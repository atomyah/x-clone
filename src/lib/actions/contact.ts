// 問い合わせフォーム用 Server Action
// レート制限・reCAPTCHA・Resend によるメール送信
//
// 必要な環境変数（.env に追加）:
//   CONTACT_EMAIL        - 管理者メールアドレス（必須）
//   RESEND_API_KEY       - Resend APIキー（必須）
//   RECAPTCHA_SECRET_KEY - reCAPTCHA v3 シークレットキー（任意、未設定時は検証スキップ）
//   NEXT_PUBLIC_RECAPTCHA_SITE_KEY - reCAPTCHA v3 サイトキー（任意、RECAPTCHA_SECRET_KEYとセット）

'use server';

import { auth } from '@clerk/nextjs/server';
import { Resend } from 'resend';
import { headers } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY);

/** レート制限用: IP -> { count, resetAt } */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1時間
const RATE_LIMIT_MAX = 3; // 1時間あたり3回まで

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      message: '送信回数の上限に達しました。しばらく時間をおいてから再度お試しください。',
    };
  }

  entry.count += 1;
  return { allowed: true };
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });
  const data = (await res.json()) as { success?: boolean; score?: number };
  return Boolean(data.success && (data.score ?? 0) >= 0.5);
}

export type SubmitContactState = {
  success: boolean;
  error?: string;
};

export async function submitContact(
  _prevState: SubmitContactState | null,
  formData: FormData
): Promise<SubmitContactState> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'お問い合わせにはログインが必要です。' };
    }

    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail) {
      return { success: false, error: '管理者メールが設定されていません。' };
    }

    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'メール送信の設定が完了していません。' };
    }

    // レート制限
    const ip = await getClientIp();
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.message };
    }

    // reCAPTCHA 検証（RECAPTCHA_SECRET_KEY が設定されている場合のみ）
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret) {
      const recaptchaToken = formData.get('recaptcha_token') as string | null;
      if (!recaptchaToken || recaptchaToken === 'skip') {
        return { success: false, error: 'reCAPTCHAの検証に失敗しました。ページを再読み込みして再度お試しください。' };
      }

      const recaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return { success: false, error: 'ボット検証に失敗しました。再度お試しください。' };
      }
    }

    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const subject = (formData.get('subject') as string)?.trim();
    const message = (formData.get('message') as string)?.trim();

    if (!name || !email || !subject || !message) {
      return { success: false, error: 'すべての項目を入力してください。' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: '有効なメールアドレスを入力してください。' };
    }

    if (message.length > 1000) {
      return { success: false, error: 'お問い合わせ内容は5000文字以内で入力してください。' };
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const fromLabel = process.env.RESEND_FROM_LABEL || 'お問い合わせ';
    const from = `${fromLabel} <${fromEmail}>`;

    // 管理者へ通知
    const adminHtml = `
      <h2>お問い合わせがありました</h2>
      <p><strong>お名前:</strong> ${escapeHtml(name)}</p>
      <p><strong>メールアドレス:</strong> ${escapeHtml(email)}</p>
      <p><strong>件名:</strong> ${escapeHtml(subject)}</p>
      <h3>お問い合わせ内容:</h3>
      <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 1rem; border-radius: 4px;">${escapeHtml(message)}</pre>
    `;

    const { error: adminError } = await resend.emails.send({
      from,
      to: [contactEmail],
      subject: `[お問い合わせ] ${subject}`,
      html: adminHtml,
      replyTo: email,
    });

    if (adminError) {
      console.error('管理者メール送信エラー:', adminError);
      return { success: false, error: 'メールの送信に失敗しました。しばらくしてから再度お試しください。' };
    }

    // ユーザーへ自動返信（送信完了メール）
    // Resend テストモード（onboarding@resend.dev）では送信先がアカウント所有者のみに制限されるため、
    // テスト時は CONTACT_EMAIL 宛に送る（ドメイン認証後はユーザー宛に送信される）
    const autoReplyTo = fromEmail === 'onboarding@resend.dev' ? contactEmail : email;

    const userHtml = `
      <p>${escapeHtml(name)} 様</p>
      <p>お問い合わせいただきありがとうございます。</p>
      <p>以下の内容で受け付けました。担当者より折り返しご連絡いたします。</p>
      <hr />
      <p><strong>件名:</strong> ${escapeHtml(subject)}</p>
      <p><strong>お問い合わせ内容:</strong></p>
      <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 1rem; border-radius: 4px;">${escapeHtml(message)}</pre>
      <hr />
      <p>このメールは自動送信されています。このメールに返信されても対応できませんのでご了承ください。</p>
    `;

    const { error: userError } = await resend.emails.send({
      from,
      to: [autoReplyTo],
      subject: `[お問い合わせを受け付けました] ${subject}`,
      html: userHtml,
    });

    if (userError) {
      console.error('自動返信メール送信エラー:', userError);
    }

    return { success: true };
  } catch (err) {
    console.error('問い合わせ送信エラー:', err);
    return { success: false, error: '予期せぬエラーが発生しました。しばらくしてから再度お試しください。' };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
