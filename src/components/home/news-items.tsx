'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import type { NewsItem } from '@/types/post';

interface NewsItemsProps {
  items: NewsItem[];
}

export function NewsItems({ items }: NewsItemsProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">本日のニュース</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="mb-4 pb-4 border-b last:border-b-0 last:mb-0 last:pb-0 hover:bg-muted/50 p-2 rounded cursor-pointer -mx-2"
        >
          <div className="flex items-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=50" />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">{item.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

