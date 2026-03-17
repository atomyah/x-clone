import { redirect } from 'next/navigation';
import { getCurrentUserUsername } from '@/lib/users';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const username = await getCurrentUserUsername();

  if (username) {
    redirect(`/profile/${username}`);
  }

  redirect('/');
}
