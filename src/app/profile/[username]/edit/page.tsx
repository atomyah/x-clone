import { notFound, redirect } from 'next/navigation';
import { Sidebar } from '@/components/home/sidebar';
import { RightSidebar } from '@/components/home/right-sidebar';
import { ProfileEditForm } from '@/components/profile/profile-edit-form';
import { getUserByUsername, getCurrentUserId } from '@/lib/users';
import { formatUserProfile } from '@/lib/mappers';
import type { LiveEvent, NewsItem } from '@/types/post';

const liveEvents: LiveEvent[] = [];
const newsItems: NewsItem[] = [];

interface ProfileEditPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfileEditPage({ params }: ProfileEditPageProps) {
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

  // 自分のプロフィールでない場合はリダイレクト
  if (!isOwnProfile) {
    redirect(`/profile/${username}`);
  }

  // ユーザープロフィール情報をフォーマット
  const profile = formatUserProfile(user);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-screen overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[600px] min-w-0">
          <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 px-4 py-3 border-b">
            <h1 className="text-xl font-bold">プロフィールを編集</h1>
          </div>
          
          <div className="p-6">
            <ProfileEditForm
              initialData={{
                displayName: profile.displayName,
                username: profile.username.replace('@', ''),
                bio: profile.bio,
                profileImageUrl: profile.avatar,
                coverImageUrl: profile.bannerImage,
              }}
            />
          </div>
        </main>

        <RightSidebar className="hidden lg:flex" liveEvents={liveEvents} newsItems={newsItems} />
      </div>
    </div>
  );
}
