'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { LiveEvents } from './live-events';
import { NewsItems } from './news-items';
import type { LiveEvent, NewsItem } from '@/types/post';

interface RightSidebarProps {
  liveEvents: LiveEvent[];
  newsItems: NewsItem[];
  className?: string;
}

export function RightSidebar({ liveEvents, newsItems, className }: RightSidebarProps) {
  return (
    <aside className={`w-[300px] sticky top-0 px-4 py-4 flex flex-col gap-4 ${className || ''}`}>

      <Card className="overflow-hidden shrink-0">
        <div className="p-4">
          <h2 className="font-bold text-xl mb-3 text-zinc-400 dark:text-zinc-500">プレミアムにサブスクライブ</h2>
          <p className="text-sm text-zinc-400/90 dark:text-zinc-500 mb-4">
            サブスクライブして新機能を利用しましょう。資格を満たしている場合、収益配分を受け取れます。
          </p>
          <Button className="w-full rounded-full font-bold bg-zinc-600 text-white hover:bg-zinc-700">
            購入は…させぬ
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden shrink-0">
        <LiveEvents events={liveEvents} />
      </Card>

      <Card className="overflow-hidden shrink-0">
        <NewsItems items={newsItems} />
      </Card>
    </aside>
  );
}

