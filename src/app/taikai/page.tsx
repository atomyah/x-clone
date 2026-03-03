import Image from 'next/image';
import { Sidebar } from '@/components/home/sidebar';

import taikai1 from '../../../images/taikai/taikai_1.png';
import taikai2 from '../../../images/taikai/taikai_2.png';
import taikai3 from '../../../images/taikai/taikai_3.png';
import taikai4 from '../../../images/taikai/taikai_4.png';
import taikai5 from '../../../images/taikai/taikai_5.png';
import taikai6 from '../../../images/taikai/taikai_6.png';
import taikai7 from '../../../images/taikai/taikai_7.png';

const steps = [
  {
    title: '1. 左下のプロフィールアイコンをクリック',
    description: 'サイドバー下部のプロフィール行から、アカウント設定を開きます。',
    image: taikai1,
  },
  {
    title: '2. 「セキュリティ」タブを選択',
    description: 'アカウント管理メニューで「セキュリティ」に移動します。',
    image: taikai2,
  },
  {
    title: '3. 「アカウントの削除」をクリック',
    description: 'セキュリティ画面の下部にある削除アクションを選択します。',
    image: taikai3,
  },
  {
    title: '4. 確認入力欄に「アカウント削除」と入力',
    description: '確認ダイアログが表示されたら、指定テキストを入力します。',
    image: taikai4,
  },
  {
    title: '5. 赤い「アカウント削除」ボタンを押す',
    description: '入力後、削除ボタンが有効化されるので実行します。',
    image: taikai5,
  },
  {
    title: '6. メール確認コードを入力',
    description: '確認が必要な場合は、メールで届いたコードを入力します。',
    image: taikai6,
  },
  {
    title: '7. 退会後は「ログアウトする」表示になることを確認',
    description: 'アカウントが無効化されると、ログイン状態が解除されます。',
    image: taikai7,
  },
];

export default function TaikaiPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-screen overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[800px] min-w-0 border-x border-border/40">
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm px-5 py-4 border-b border-border/50">
            <h1 className="text-2xl font-bold">退会方法（アカウント削除手順）</h1>
            <p className="text-sm text-muted-foreground mt-1">
              画像つきで、アカウント設定から退会完了までの手順を順番に説明します。
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
