// 入会方法ページ

import Image from 'next/image';
import { Sidebar } from '@/components/home/sidebar';

import nyukai1 from '../../../images/nyukai/nyukai_1.png';
import nyukai2 from '../../../images/nyukai/nyukai_2.png';
import nyukai3 from '../../../images/nyukai/nyukai_3.png';
import nyukai4 from '../../../images/nyukai/nyukai_4.png';
import nyukai5 from '../../../images/nyukai/nyukai_5.png';
import nyukai6 from '../../../images/nyukai/nyukai_6.png';
import nyukai7 from '../../../images/nyukai/nyukai_7.png';
import nyukai8 from '../../../images/nyukai/nyukai_8.png';
import nyukai9 from '../../../images/nyukai/nyukai_9.png';
import nyukai91 from '../../../images/nyukai/nyukai_91.png';
import nyukai92 from '../../../images/nyukai/nyukai_92.png';
import nyukai93 from '../../../images/nyukai/nyukai_93.png';
import nyukai94 from '../../../images/nyukai/nyukai_94.png';

const steps = [
  {
    title: '1. 左サイドバーの「ログイン（あるいは入会）」をクリック',
    description: '最初に、左サイドバーのログインボタンから入会フローを開始します。',
    image: nyukai1,
  },
  {
    title: '2. サインイン画面で「サインアップ」を選択',
    description: 'すでにアカウントがある人向けのサインイン画面が出ます。初めての方は下部の「サインアップ」をクリックします。',
    image: nyukai2,
  },
  {
    title: '3. GoogleまたはGitHubで入会方法を選ぶ',
    description: 'おすすめはGoogle連携です。ここではGoogleを選んで進めます。',
    image: nyukai3,
  },
  {
    title: '4. Google連携をしたくない方は「メールアドレス」等々を入力して進みます',
    description: 'メールアドレスでサインアップしたい場合は、ユーザー名・メールアドレス・パスワードを入力して次へ進みます（この後７番へ進みます）。',
    image: nyukai4,
  },
  {
    title: '5. Google認証画面でGoogleアカウントを選択',
    description: '連携したいGoogleアカウントを選びます（対象Googleアカウントをクリックしてください）。',
    image: nyukai5,
  },
  {
    title: '6. Google認証画面の連携確認で「次へ」をクリック',
    description: 'Google認証画面の確認画面で「次へ」をクリックして進みます。',
    image: nyukai6,
  },
  {
    title: '7. ユーザー名の追加入力を求められたら入力',
    description: '任意のユーザー名を設定してください。後で変更できるのでここでは適当に入力してください。',
    image: nyukai7,
  },
  {
    title: '8. これで入会完了です。',
    description: '入会完了しアカウント作成後は、画面左下プロフィール部分に「ユーザー名」「アバターアイコン」が表示されます。',
    image: nyukai8,
  },
  {
    title: '9. アバターアイコン部分をクリックしてプロフィール設定へ',
    description: 'プロフィール画像の丸いアイコンをクリックすると、自分のプロフィール設定画面へ進めます。',
    image: nyukai9,
  },
  {
    title: '10. Clerk管理画面が開きます。',
    description: 'Clerk管理画面の「プロフィールを更新」または「ユーザー名の変更」で、名前や表示名、ユーザー名を変更できます。',
    image: nyukai91,
  },
  {
    title: '11. 「プロフィールを更新」では「名」「姓」また、アバター画像を変更できます。',
    description: 'アバター画像を変更したい場合は、アバター画像「アップロード」をクリックして変更します。',
    image: nyukai92,
  },
  {
    title: '12. 「ユーザー名の変更」では＠以降のユーザー名を変更できます。',
    description: '＠マークのうしろに表示されるユーザー名を変更できます。',
    image: nyukai93,
  },
  {
    title: '13. メール認証コードを入力して完了',
    description: '必要な場合はメール認証が求められます。あなたのメールアドレスに６桁の数字が届きます。そのコードを入力して「続ける」ボタンをクリックして完了です。',
    image: nyukai94,
  },
];

export default function NyukaiPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-screen overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[800px] min-w-0 border-x border-border/40">
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm px-5 py-4 border-b border-border/50">
            <h1 className="text-2xl font-bold">入会方法（サインアップ手順）</h1>
            <p className="text-sm text-muted-foreground mt-1">
              画像つきで、初回ログインからプロフィール設定までを順番に説明します。
            </p>
          </div>

          <div className="p-5 space-y-8">
            {steps.map((step) => (
              <section
                key={step.title}
                className="rounded-2xl border border-border/50 bg-card p-4 md:p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

                <div className="mt-4 rounded-xl border border-border/40 overflow-hidden bg-muted/20">
                  <Image
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto object-contain"
                    placeholder="blur"
                    priority={step.title.startsWith('1.')}
                  />
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
