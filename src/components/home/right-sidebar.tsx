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
    <aside className={`w-[350px] sticky top-0 px-4 py-4 flex flex-col gap-4 ${className || ''}`}>
      <div className="relative shrink-0">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          className="w-full h-11 pl-12 rounded-full bg-muted border-none"
          placeholder="検索"
        />
      </div>

      <Card className="overflow-hidden shrink-0">
        <div className="p-4">
          <h2 className="font-bold text-xl mb-3">プレミアムにサブスクライブ</h2>
          <p className="text-sm text-muted-foreground mb-4">
            サブスクライブして新機能を利用しましょう。資格を満たしている場合、収益配分を受け取れます。
          </p>
          <Button className="w-full rounded-full font-bold">
            購入する
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

