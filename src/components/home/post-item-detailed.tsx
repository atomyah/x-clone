'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Pin,
  Bookmark,
  BarChart3,
} from 'lucide-react';
import type { Post, PostWithReplies } from '@/types/post';
import { formatDetailDateTime } from '@/lib/format-date';

interface PostItemDetailedProps {
  post: Post | PostWithReplies;
  showReplies?: boolean;
}

/**
 * 投稿詳細ページ用のPostItemコンポーネント
 * 投稿全体をクリックしても遷移しない（既に詳細ページにいるため）
 */
export function PostItemDetailed({ post, showReplies = false }: PostItemDetailedProps) {
  // usernameから@を除去してプロフィールURLを生成
  const profileUrl = `/profile/${post.user.username.replace('@', '')}`;
  
  // repliesが配列の場合は数値に変換、そうでなければそのまま使用
  const repliesCount = Array.isArray(post.replies) ? post.replies.length : post.replies;
  
  // 詳細ページ用の日時表示
  const dateTime = post.createdAt ? formatDetailDateTime(post.createdAt) : null;

  return (
    <article className="p-4 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-colors group">
      <div className="flex gap-3">
        <Link href={profileUrl} className="shrink-0">
          <Avatar>
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              {post.pinned && (
                <Pin className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <Link href={profileUrl} className="font-bold hover:underline truncate">
                {post.user.name}
              </Link>
              <Link href={profileUrl} className="text-muted-foreground text-sm shrink-0 hover:underline">
                {post.user.username}
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0"
              title="その他"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-base mb-3 leading-normal">
            {post.content}
          </p>
          
          {/* タイムスタンプと表示数 */}
          {dateTime && (
            <div className="mb-3 text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <span>{dateTime.time}</span>
                <span>·</span>
                <span>{dateTime.date}</span>
                {post.views !== undefined && (
                  <>
                    <span>·</span>
                    <span>{post.views.toLocaleString()} 件の表示</span>
                  </>
                )}
              </div>
            </div>
          )}

          {post.images && post.images.length > 0 && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-muted relative w-full aspect-auto max-h-96">
              <Image
                src={post.images[0]}
                alt="post"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}

          {post.hasLink && (
            <div className="mb-3 border rounded-2xl overflow-hidden hover:bg-muted/50 p-3 bg-muted/30">
              <p className="text-sm text-blue-600 font-medium">
                {post.link}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between max-w-md text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-primary hover:bg-primary/10"
              title="返信"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{repliesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-green-600 hover:bg-green-600/10"
              title="リポスト"
            >
              <Repeat2 className="w-4 h-4" />
              <span>{post.retweets}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-red-600 hover:bg-red-600/10"
              title="いいね"
            >
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-primary hover:bg-primary/10"
              title="ブックマーク"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-primary hover:bg-primary/10"
              title="共有"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
