// Server Component
// 
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/home/sidebar';
import { RightSidebar } from '@/components/home/right-sidebar';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { ProfileTimeline } from '@/components/profile/profile-timeline';
import { getUserByUsername, getCurrentUserId, isFollowing } from '@/lib/users';
import { getUserPosts } from '@/lib/posts';
import { mapPostsToUI, formatUserProfile } from '@/lib/mappers';
import type { Post, LiveEvent, NewsItem } from '@/types/post';

const liveEvents: LiveEvent[] = [];
const newsItems: NewsItem[] = [];

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  
  // データアクセス層からユーザー情報を取得
  const user = await getUserByUsername(username);
  
  if (!user) {
    notFound();
  }

  // 現在のログインユーザーIDを取得
  const currentUserId = await getCurrentUserId();
  
  // 表示しているユーザーが自分のプロフィールかどうかを判定
  const isOwnProfile = currentUserId === user.id;

  // フォロー状態を取得（自分のプロフィールの場合はfalse）
  const followingStatus = isOwnProfile ? false : await isFollowing(user.id, currentUserId);

  // データアクセス層からユーザーの投稿を取得
  const dbPosts = await getUserPosts(user.id);
  
  // データ変換層でUI用の型に変換
  const posts = mapPostsToUI(dbPosts);
  
  // ユーザープロフィール情報をフォーマット
  const profile = formatUserProfile(user);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-screen overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[600px] min-w-0">
          <ProfileHeader name={profile.displayName} postCount={profile.postCount} />
          
          <ProfileInfo
            bannerImage={profile.bannerImage}
            avatar={profile.avatar}
            name={profile.displayName}
            username={profile.username}
            verified={false}
            bio={profile.bio}
            joinedDate={profile.joinedDate}
            following={profile.following}
            followers={profile.followers}
            isOwnProfile={isOwnProfile}
            userId={user.id}
            isFollowing={followingStatus}
          />

          <ProfileTabs />
          {posts.length > 0 ? (
            <ProfileTimeline posts={posts} />
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
