'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProfileTabs() {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-start rounded-none bg-transparent h-auto p-0 overflow-x-auto scrollbar-hide">
        <TabsTrigger
          value="posts"
          className="data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-primary"
        >
          ポスト
        </TabsTrigger>
        <TabsTrigger
          value="replies"
          className="data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-primary"
        >
          返信
        </TabsTrigger>
        <TabsTrigger
          value="media"
          className="data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-primary"
        >
          メディア
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

