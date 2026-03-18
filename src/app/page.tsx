import { Sidebar } from '@/components/home/sidebar';

export const dynamic = 'force-dynamic';
import { RightSidebar } from '@/components/home/right-sidebar';
import { PostForm } from '@/components/home/post-form';
import { PostList } from '@/components/home/post-list';
import { WebhookSyncStatus } from '@/components/home/webhook-sync-status';
import { getTimelinePosts } from '@/lib/posts';
import { mapPostsToUI } from '@/lib/mappers';

export default async function Home() {
  // データアクセス層から投稿データを取得
  const dbPosts = await getTimelinePosts();

  // データ変換層でUI用の型に変換
  const posts = mapPostsToUI(dbPosts);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-screen overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[600px] min-w-0">
          <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 px-4 py-3 flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold">ホーム</h1>
            <WebhookSyncStatus />
          </div>
          
          <PostForm />
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>まだ投稿がありません</p>
              <p className="text-sm mt-2">最初の投稿をしてみましょう！</p>
            </div>
          )}
        </main>

        <RightSidebar className="hidden lg:flex" />
      </div>
    </div>
  );
}
