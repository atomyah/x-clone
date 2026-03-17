'use client';

import { useActionState, useEffect, useRef, useState, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitContact } from '@/lib/actions/contact';
import { useUser } from '@clerk/nextjs';
import { Contact } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const { user } = useUser();

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  useEffect(() => {
    if (!siteKey) {
      setRecaptchaReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => setRecaptchaReady(true));
      } else {
        setRecaptchaReady(true);
      }
    };
    document.head.appendChild(script);
    return () => {
      const existing = document.querySelector(`script[src*="recaptcha"]`);
      if (existing) existing.remove();
    };
  }, [siteKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (siteKey && recaptchaReady && window.grecaptcha) {
      try {
        const token = await window.grecaptcha.execute(siteKey, { action: 'submit' });
        formData.set('recaptcha_token', token);
      } catch {
        formData.set('recaptcha_token', '');
      }
    } else if (!siteKey) {
      formData.set('recaptcha_token', 'skip');
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const defaultName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress?.split('@')[0] || ''
    : '';
  const defaultEmail = user?.emailAddresses[0]?.emailAddress || '';

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          お名前 <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          placeholder="晴山　紋音"
          className="w-full"
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          メールアドレス <span className="text-destructive">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          placeholder="example@example.com"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">
          件名 <span className="text-destructive">*</span>
        </label>
        <Input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="お問い合わせの件名"
          className="w-full"
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          お問い合わせ内容 <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="お問い合わせ内容をご記入ください（例：退会できない、ログインできない、など）"
          className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground md:text-sm disabled:pointer-events-none disabled:opacity-50"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">1000文字以内</p>
      </div>

      {state?.error && (
        <p className="text-lg text-red-600 dark:text-red-400">
          {/* contact.ts, 158行目の　error: 'メールの送信に失敗しました。しばらくしてから再度お試しください。' */}
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-lg text-green-600 dark:text-green-400">
          お問い合わせを受け付けました。確認メールをお送りしましたのでご確認ください。
        </p>
      )}

      <Button type="submit" disabled={!recaptchaReady && !!siteKey}>
        送信する
      </Button>
    </form>
  );
}
