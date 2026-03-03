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
    description: 'すでにアカウントがある人向けのサインイン画面が出るので、下部のサインアップへ進みます。',
    image: nyukai2,
  },
  {
    title: '3. GoogleまたはGitHubで入会方法を選ぶ',
    description: 'おすすめはGoogle連携です。ここではGoogleを選んで進めます。',
    image: nyukai3,
  },
  {
    title: '4. 必要情報を入力して「続ける」',
    description: 'ユーザー名・メールアドレス・パスワードを入力して次へ進みます。',
    image: nyukai4,
  },
  {
    title: '5. Googleアカウントを選択',
    description: '連携したいGoogleアカウントを選びます。',
    image: nyukai5,
  },
  {
    title: '6. 連携確認で「次へ」をクリック',
    description: 'Clerk連携の確認画面で次へ進みます。',
    image: nyukai6,
  },
  {
    title: '7. ユーザー名の追加入力を求められたら入力',
    description: '未入力項目がある場合だけ表示されます。任意のユーザー名を設定してください。',
    image: nyukai7,
  },
  {
    title: '8. 入会完了後、左下のプロフィール行を開く',
    description: 'アカウント作成後は、左下プロフィール部分から詳細設定ができます。',
    image: nyukai8,
  },
  {
    title: '9. アバター部分をクリックしてプロフィール設定へ',
    description: 'プロフィール画像の丸いアイコンをクリックすると、設定画面へ進めます。',
    image: nyukai9,
  },
  {
    title: '10. 「プロフィールを更新」または「ユーザー名の変更」を開く',
    description: '名前や表示名、ユーザー名を整える場合はこの2つを使います。',
    image: nyukai91,
  },
  {
    title: '11. 表示名を編集して保存',
    description: '名・姓を入力し、保存で反映します。',
    image: nyukai92,
  },
  {
    title: '12. ユーザー名を編集して保存',
    description: '他ユーザーに表示されるユーザー名を整えます。',
    image: nyukai93,
  },
  {
    title: '13. メール認証コードを入力して完了',
    description: '必要な場合はメール認証が求められます。届いたコードを入力して完了です。',
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
