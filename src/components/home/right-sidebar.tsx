'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Ads } from './ads';
import { NewsItems } from './news-items';
import type { Ad, NewsItem } from '@/types/post';

// 広告データ（将来的にAPI/DBから取得する想定）
const ads: Ad[] = [
  {
    id: 1,
    url: 'https://amzn.to/3r3jnP3',
    title: 'おすすめ商品： 書籍『ベンゾ系睡眠薬・抗不安薬からの安全な離脱方法』',
    image: '/images/ads/ad_01.png',
  },
];

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'あしろう占いPCが...',
    status: 'さんがホストしています',
    verified: true,
  },
  {
    id: 2,
    title: '宣伝オリボス金闘スペース【引用リプOK】',
    status: 'さんがホストしています',
  },
];

interface RightSidebarProps {
  className?: string;
}

export function RightSidebar({ className }: RightSidebarProps) {
  return (
    <aside className={`w-[300px] sticky top-0 px-4 py-4 flex flex-col gap-4 ${className || ''}`}>

      <Card className="overflow-hidden shrink-0">
        <div className="p-4">
          <h2 className="font-bold text-xl mb-3 text-zinc-400 dark:text-zinc-500">プレミアムにサブスクライブ</h2>
          <p className="text-sm text-zinc-400/90 dark:text-zinc-500 mb-4">
            サブスクライブして新機能を利用しましょう。資格を満たしている場合、収益配分を受け取れます。
          </p>
          <Button className="w-full rounded-full font-bold bg-zinc-600 text-white hover:bg-zinc-700">
            プレミアムはまだありません
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden shrink-0">
        <Ads ads={ads} />
      </Card>

      <Card className="overflow-hidden shrink-0">
        <NewsItems items={newsItems} />
      </Card>
    </aside>
  );
}

