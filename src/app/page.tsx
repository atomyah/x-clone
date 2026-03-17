import { Sidebar } from '@/components/home/sidebar';

export const dynamic = 'force-dynamic';
import { RightSidebar } from '@/components/home/right-sidebar';
import { PostForm } from '@/components/home/post-form';
import { PostList } from '@/components/home/post-list';
import { WebhookSyncStatus } from '@/components/home/webhook-sync-status';
import { getTimelinePosts } from '@/lib/posts';
import { mapPostsToUI } from '@/lib/mappers';
import type { Post, LiveEvent, NewsItem } from '@/types/post';

// 以下のダミーデータは<RightSidebar />コンポーネントのダミーデータ.
const liveEvents: LiveEvent[] = [
  {
    id: 1,
    user: 'まる',
    status: '（本人）',
    title: 'さづだーん笑お🎄11時終✓',
    participants: [
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
      'https://images.pexels.com/photos/1288182/pexels-photo-1288182.jpeg?auto=compress&cs=tinysrgb&w=100',
    ],
    count: 14,
  },
  {
    id: 2,
    user: 'くてだまPfizer',
    status: '2🎓',
    title: 'スローぷ？レミーズ？な...',
    participants: [
      'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=100',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    ],
    count: 11,
  },
];

// 以下のダミーデータは<RightSidebar />コンポーネントのダミーデータ.
const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'あしろう占いPCが...',
    status: 'さんがホストしています',
    verified: true,
  },
  {
    id: 2,
    title: '宣伝オリボス金闘スペース【引用リプOK】',
    status: 'さんがホストしています',
  },
];

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

        <RightSidebar className="hidden lg:flex" liveEvents={liveEvents} newsItems={newsItems} />
      </div>
    </div>
  );
}
