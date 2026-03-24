// 入会方法ページ

import Image, { type StaticImageData } from 'next/image';
import { Sidebar } from '@/components/home/sidebar';

import nyukai1 from '../../../images/nyukai/nyukai_1.png';
import nyukai2 from '../../../images/nyukai/nyukai_2.png';
import nyukai3 from '../../../images/nyukai/nyukai_3.png';
import nyukai4 from '../../../images/nyukai/nyukai_4.png';
import nyukai55 from '../../../images/nyukai/nyukai_5.5.png';
import nyukai56 from '../../../images/nyukai/nyukai_5.6.png';
import nyukai5 from '../../../images/nyukai/nyukai_5.png';
import nyukai6 from '../../../images/nyukai/nyukai_6.png';
import nyukai7 from '../../../images/nyukai/nyukai_7.png';
import nyukai8 from '../../../images/nyukai/nyukai_8.png';
import nyukai9 from '../../../images/nyukai/nyukai_9.png';
import nyukai91 from '../../../images/nyukai/nyukai_91.png';
import nyukai92 from '../../../images/nyukai/nyukai_92.png';
import nyukai93 from '../../../images/nyukai/nyukai_93.png';
import nyukai94 from '../../../images/nyukai/nyukai_94.png';

type NyukaiStep = {
  title: string;
  description: string;
  image: StaticImageData;
};

const signupSteps: NyukaiStep[] = [
  {
    title: '1. 左サイドバーの「ログイン（あるいは入会）」をクリック',
    description: '最初に、左サイドバーの「ログイン（あるいは入会）」ボタンをクリックします。',
    image: nyukai1,
  },
  {
    title: '2. サインイン画面で「サインアップ」を選択',
    description: '初めての方は画面下部の赤い枠で囲ってある「サインアップ」ボタンをクリックします。※ すでに入会済みの人は「Googleで続ける」ボタンをクリックする等してサインイン（ログイン）します）',
    image: nyukai2,
  },
  {
    title: '3. GoogleまたはGitHubで入会方法を選ぶ',
    description: 'おすすめはGoogle連携での入会です。ここではGoogleを選んで入会を進めます（この後7番に進みます）。',
    image: nyukai3,
  },
  {
    title: '4. Google連携をしたくない方は「メールアドレス」等を入力して進みます',
    description: 'メールアドレスでサインアップしたい場合は、ユーザー名・メールアドレス・パスワードを入力して「続ける」ボタンをクリック。',
    image: nyukai4,
  },
  {
    title: '5. 「メールアドレスを確認」画面にコードを入力',
    description:
      'アプリの「メールアドレスを確認」画面が開きます。登録したメールアドレスに6桁の数字が送信されてきます。それを入力して「続ける」ボタンをクリックします。届かない場合は「コードを再送信」から再送できます。',
    image: nyukai55,
  },
  {
    title: '6. 登録メールに届く確認コード',
    description:
      'メールアドレスでサインアップした場合、受信箱（念のため迷惑メールフォルダも確認ください）に届いた確認メールの本文に、6桁の確認コードの記載があることを確認します（「続ける」ボタンをクリックしたら、9番に進みます）。',
    image: nyukai56,
  },
  {
    title: '7. Google認証画面でGoogleアカウントを選択',
    description: '連携したいGoogleアカウントを選びます（連携したいGoogleアカウントをクリックしてください）。',
    image: nyukai5,
  },
  {
    title: '8. Google認証画面の連携確認で「次へ」をクリック',
    description: 'Google認証画面の確認画面で「次へ」をクリックして進みます。',
    image: nyukai6,
  },
  {
    title: '9. ユーザー名の追加入力を求められたら入力',
    description: '任意のユーザー名を設定してください。後で変更できるのでここでは適当に入力してください（英文字のみ）。',
    image: nyukai7,
  },
  {
    title: '10. これで入会完了です。',
    description: '入会完了しアカウント作成されたら、自動的に画面左下プロフィール部分に「ユーザー名」「アバターアイコン」が表示されます。',
    image: nyukai8,
  },
];

const profileEditSteps: NyukaiStep[] = [
  {
    title: '11. アバターアイコン部分をクリックしてプロフィール設定へ',
    description: 'プロフィール画像の丸いアイコンをクリックすると、自分のプロフィール設定画面へ進めます。',
    image: nyukai9,
  },
  {
    title: '12. Clerk管理画面が開きます。',
    description: 'Clerk管理画面の「プロフィールを更新」または「ユーザー名の変更」で、名前や表示名、ユーザー名を変更できます。',
    image: nyukai91,
  },
  {
    title: '13. 「プロフィールを更新」では「名」「姓」また、アバター画像を変更できます。',
    description: 'アバター画像を変更したい場合は、アバター画像「アップロード」をクリックして変更します。',
    image: nyukai92,
  },
  {
    title: '14. 「ユーザー名の変更」では＠以降のユーザー名を変更できます。',
    description: '＠マークのうしろに表示されるユーザー名を変更できます。',
    image: nyukai93,
  },
  {
    title: '15. メール認証コードを入力して完了',
    description: '必要な場合はメール認証が求められます。あなたのメールアドレスに６桁の数字が届きます。そのコードを入力して「続ける」ボタンをクリックして完了です。',
    image: nyukai94,
  },
];

function StepSection({ step, priority }: { step: NyukaiStep; priority?: boolean }) {
  return (
    <section className="rounded-2xl border border-border/50 bg-card p-4 md:p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{step.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

      <div className="mt-4 rounded-xl border border-border/40 overflow-hidden bg-muted/20">
        <Image
          src={step.image}
          alt={step.title}
          className="w-full h-auto object-contain"
          placeholder="blur"
          priority={priority}
        />
      </div>
    </section>
  );
}

export default function NyukaiPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-screen overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[800px] min-w-0 border-x border-border/40">
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm px-5 py-4 border-b border-border/50">
            <h1 className="text-2xl font-bold">入会方法・プロフィール編集</h1>
            <p className="text-sm text-muted-foreground mt-1">
              入会（サインアップ）の流れと、入会後のプロフィール編集を画像つきで説明します。
            </p>
          </div>

          <div className="p-5 space-y-12">
            <section className="space-y-6" aria-labelledby="nyukai-signup-heading">
              <div>
                <h2 id="nyukai-signup-heading" className="text-xl font-bold">
                  入会方法（サインアップ手順）
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  初めて利用する方向けの手順です（手順1〜10）。
                </p>
              </div>
              <div className="space-y-8">
                {signupSteps.map((step, index) => (
                  <StepSection key={step.title} step={step} priority={index === 0} />
                ))}
              </div>
            </section>

            <section
              className="space-y-6 pt-2 border-t border-border/50"
              aria-labelledby="nyukai-profile-heading"
            >
              <div>
                <h2 id="nyukai-profile-heading" className="text-xl font-bold">
                  プロフィールの編集
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  すでに入会済みの方向けです。アバターから Clerk の管理画面を開き、表示名・ユーザー名・アバターなどを変更できます（手順11〜15）。
                </p>
              </div>
              <div className="space-y-8">
                {profileEditSteps.map((step) => (
                  <StepSection key={step.title} step={step} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
