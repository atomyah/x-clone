'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ImageIcon,
  Smile,
} from 'lucide-react';

interface ReplyFormProps {
  postId?: string;
  replyToUsername?: string;
}

export function ReplyForm({ postId, replyToUsername }: ReplyFormProps) {
  const [replyContent, setReplyContent] = useState('');

  return (
    <div className="px-4 py-3">
      {replyToUsername && (
        <div className="mb-2 text-sm text-muted-foreground pl-14">
          返信先: <span className="text-primary">@{replyToUsername}</span>さん
        </div>
      )}
      <div className="flex gap-3 items-start">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src="https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=100" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <input
            type="text"
            className="w-full bg-transparent text-2xl placeholder:text-muted-foreground focus:outline-none mb-3 py-5 min-h-[60px]"
            placeholder="返信をポスト"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary hover:bg-primary/10 shrink-0"
                title="メディア"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary hover:bg-primary/10 shrink-0"
                title="GIF画像"
              >
                <div className="w-5 h-5 flex items-center justify-center text-xs font-bold">GIF</div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary hover:bg-primary/10 shrink-0"
                title="絵文字"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>
            <Button
              variant="outline"
              className="rounded-full font-bold px-4 h-9 text-sm shrink-0 disabled:opacity-50"
              disabled={!replyContent.trim()}
            >
              返信
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
