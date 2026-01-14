'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Search } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  postCount: number;
}

export function ProfileHeader({ name, postCount }: ProfileHeaderProps) {
  return (
    <div className="sticky top-0 bg-background/80 backdrop-blur-md z-20 flex items-center justify-between px-4 h-14">
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" title="戻る">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm md:text-base truncate">{name}</span>
          <span className="text-xs md:text-sm text-muted-foreground hidden md:block">
            {postCount.toLocaleString()} 件のポスト
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" className="h-9 w-9" title="更新">
          <RefreshCw className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9" title="検索">
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

