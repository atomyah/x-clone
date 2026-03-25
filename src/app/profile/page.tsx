import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/home/sidebar';
import { RightSidebar } from '@/components/home/right-sidebar';
import { ProfileLoginGate } from '@/components/profile/profile-login-gate';
import { getCurrentUserUsername } from '@/lib/users';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const username = await getCurrentUserUsername();

  if (username) {
    redirect(`/profile/${username}`);
  }

  const { userId } = await auth();
  if (userId) {
    // ログイン済みだが DB にユーザーがまだ無い（Webhook 同期待ちなど）
    redirect('/');
  }

  return (
    <div className="h-full min-h-0 bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-full min-h-0 overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[600px] min-w-0">
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm px-4 py-3 border-b border-border/50">
            <h1 className="text-xl font-bold">プロフィール</h1>
          </div>

          <div className="p-4">
            <section className="rounded-2xl border border-border/50 bg-card p-4 md:p-5 shadow-sm">
              <ProfileLoginGate />
            </section>
          </div>
        </main>

        <RightSidebar className="hidden lg:flex" />
      </div>
    </div>
  );
}
