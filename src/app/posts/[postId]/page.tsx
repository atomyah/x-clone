import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/home/sidebar';
import { RightSidebar } from '@/components/home/right-sidebar';
import { PostItemDetailed } from '@/components/home/post-item-detailed';
import { ReplyForm } from '@/components/home/reply-form';
import { getPostWithReplies } from '@/lib/posts';
import { mapPostWithRepliesToUI } from '@/lib/mappers';
import type { Post, LiveEvent, NewsItem } from '@/types/post';

const liveEvents: LiveEvent[] = [];
const newsItems: NewsItem[] = [];

interface PostDetailPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;
  
  // データアクセス層から投稿とリプライを取得
  const dbPost = await getPostWithReplies(postId);
  
  if (!dbPost) {
    notFound();
  }

  // データ変換層でUI用の型に変換
  const post = mapPostWithRepliesToUI(dbPost);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-screen overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[600px] min-w-0">
          <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 px-4 py-3">
            <h1 className="text-xl font-bold">☜　ポスト</h1>
          </div>
          
          {/* メイン投稿 */}
          <PostItemDetailed post={post} />

          {/* 返信入力ボックス */}
          <ReplyForm postId={postId} replyToUsername={post.user.username.replace('@', '')} />

          {/* リプライ */}
          {'replies' in post && post.replies.length > 0 && (
            <div>
              {post.replies.map((reply, index) => (
                <div key={reply.uuid} className="relative">
                  {/* スレッドの縦線 */}
                  {index < post.replies.length - 1 && (
                    <div className="absolute left-[31px] top-0 bottom-0 w-px bg-border/10" />
                  )}
                  <div className="pl-4">
                    <PostItemDetailed post={reply} clickable={true} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <RightSidebar className="hidden lg:flex" liveEvents={liveEvents} newsItems={newsItems} />
      </div>
    </div>
  );
}
