// 投稿一覧表示用のPostItemコンポーネント.
// このコンポーネントはapp/page.tsxで使用されている。
// useTransitionという楽観的UI更新（Optimistic Update）を使ってる
// → handleLikeClick()関数の中の５４～７３行目
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  Pin,
} from 'lucide-react';
import type { Post } from '@/types/post';
import { toggleLike } from '@/lib/actions/posts';
import { ReplyModal } from '@/components/home/reply-modal';
import { QuoteRepostButton } from '@/components/home/quote-repost-button';

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  
  // usernameから@を除去してプロフィールURLを生成
  const profileUrl = `/profile/${post.user.username.replace('@', '')}`;
  // 投稿詳細ページへのURL（UUIDを使用）
  const postDetailUrl = post.uuid ? `/posts/${post.uuid}` : '#';

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを防ぐ
  };

  const handlePostClick = () => {
    if (postDetailUrl !== '#') {
      router.push(postDetailUrl);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを防ぐ
    
    if (!post.uuid) return;

    // 楽観的UI更新
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked); // すぐに♡を赤くする
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1); // カウントも即座に更新
    // サーバーからの応答を待たずに、すぐにUIを更新してしまう。

    // その後に、UIを更新した後、バックグラウンドでサーバーに処理を依頼
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
    <>
    <article 
      className="p-4 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-colors cursor-pointer group"
      onClick={handlePostClick}
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
                <span className="text-muted-foreground text-sm shrink-0">
                  ·
                </span>
                <span className="text-muted-foreground text-sm shrink-0">
                  {post.timestamp}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0"
                title="その他"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-base mb-3 leading-normal">
              {post.content}
            </p>

            {post.quotedPost && (
              <div className="mb-3 rounded-xl border border-transparent bg-zinc-200/55 dark:bg-zinc-800/55 p-3 transition-colors duration-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80">
                <div className="flex items-center gap-2 mb-1 min-w-0">
                  <span className="font-bold text-sm truncate">{post.quotedPost.user.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{post.quotedPost.user.username}</span>
                </div>
                <p className="text-sm text-foreground wrap-break-word">{post.quotedPost.content}</p>
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
                className="h-8 gap-2 hover:text-green-600 hover:bg-green-600/10"
                title="返信"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReplyModalOpen(true);
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.replies}</span>
              </Button>
              <QuoteRepostButton
                postId={post.uuid}
                retweets={post.retweets}
                quotedToUsername={post.user.username}
                quotedToName={post.user.name}
                quotedToContent={post.content}
                quotedToAvatar={post.user.avatar}
              />
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 gap-2 hover:text-red-600 hover:bg-red-600/10 ${
                  isLiked ? 'text-red-600' : ''
                }`}
                title="いいね"
                onClick={handleLikeClick}
                disabled={isPending}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2 text-muted-foreground/20 hover:text-muted-foreground/20 hover:bg-transparent cursor-not-allowed"
                title="共有"
                onClick={(e) => e.stopPropagation()}
                disabled
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>
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
    </>
  );
}

