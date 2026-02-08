// 投稿詳細ページ表示用のPostItemDetailedコンポーネント.
// このコンポーネントはapp/posts/[postId]/page.tsxで使用されている。
// useTransitionという楽観的UI更新（Optimistic Update）を使ってる
// → handleLikeClick()関数の中の５０～７０行目
// 59.返信ボタンクリックでモーダルを開く機能を追加モーダルの開閉状態を管理するstateを追加

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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
import { toggleLike } from '@/lib/actions/posts';
import { ReplyModal } from '@/components/home/reply-modal';

interface PostItemDetailedProps {
  post: Post | PostWithReplies;
  showReplies?: boolean;
  clickable?: boolean; // クリックで詳細ページに遷移するかどうか
}

/**
 * 投稿詳細ページ用のPostItemコンポーネント
 * clickableがtrueの場合はクリックで詳細ページに遷移する
 */
export function PostItemDetailed({ post, showReplies = false, clickable = false }: PostItemDetailedProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  
  // usernameから@を除去してプロフィールURLを生成
  const profileUrl = `/profile/${post.user.username.replace('@', '')}`;
  
  // 投稿詳細ページへのURL（UUIDを使用）
  const postDetailUrl = post.uuid ? `/posts/${post.uuid}` : '#';
  
  // repliesが配列の場合は数値に変換、そうでなければそのまま使用
  const repliesCount = Array.isArray(post.replies) ? post.replies.length : post.replies;
  
  // 詳細ページ用の日時表示
  const dateTime = post.createdAt ? formatDetailDateTime(post.createdAt) : null;

  const handlePostClick = () => {
    if (clickable && postDetailUrl !== '#') {
      router.push(postDetailUrl);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを防ぐ
  };

  const handleLikeClick = async () => {
    if (!post.uuid) return;

    // 楽観的UI更新
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

    startTransition(async () => {
      const result = await toggleLike(post.uuid!);
      
      if (!result.success) {
        // エラー時は元に戻す
        setIsLiked(!newIsLiked);
        setLikesCount(prev => newIsLiked ? prev - 1 : prev + 1);
      } else {
        // 成功時はサーバーの状態に合わせる
        setIsLiked(result.isLiked);
      }
    });
  };

  return (
    <article 
      className={`p-4 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-colors group ${clickable ? 'cursor-pointer' : ''}`}
      onClick={clickable ? handlePostClick : undefined}
    >
      <div className="flex gap-3">
        <Link href={profileUrl} className="shrink-0" onClick={handleProfileClick}>
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
              <Link href={profileUrl} className="font-bold hover:underline truncate" onClick={handleProfileClick}>
                {post.user.name}
              </Link>
              <Link href={profileUrl} className="text-muted-foreground text-sm shrink-0 hover:underline" onClick={handleProfileClick}>
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
              onClick={(e) => {
                e.stopPropagation();
                setIsReplyModalOpen(true);
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{repliesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-green-600 hover:bg-green-600/10"
              title="リポスト"
              onClick={(e) => e.stopPropagation()}
            >
              <Repeat2 className="w-4 h-4" />
              <span>{post.retweets}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 gap-2 hover:text-red-600 hover:bg-red-600/10 ${
                isLiked ? 'text-red-600' : ''
              }`}
              title="いいね"
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick();
              }}
              disabled={isPending}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-primary hover:bg-primary/10"
              title="ブックマーク"
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hover:text-primary hover:bg-primary/10"
              title="共有"
              onClick={(e) => e.stopPropagation()}
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* 返信モーダル */}
      {post.uuid && (
        <ReplyModal
          open={isReplyModalOpen}
          onOpenChange={setIsReplyModalOpen}
          postId={post.uuid}
          replyToUsername={post.user.username}
          replyToName={post.user.name}
          replyToContent={post.content}
          replyToAvatar={post.user.avatar}
        />
      )}
    </article>
  );
}
