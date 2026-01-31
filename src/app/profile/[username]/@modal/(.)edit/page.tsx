// プロフィール編集モーダルページ
// インターセプティングルート./profile/[username]/editにアクセスした際、ルートをインターセプトしてモーダルを表示
// (.) は同じ階層のルートをインターセプトする記号
// components/ui/dialog.tsxからDialogと、
// components/profile/profile-edit-form.tsからProfileEditFormと、
// app/profile/[username]/@modal/(.)edit/profile-edit-modal-client.tsxからProfileEditModalClient
// を呼んでる

import { notFound } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileEditForm } from '@/components/profile/profile-edit-form';
import { getUserByUsername, getCurrentUserId } from '@/lib/users';
import { formatUserProfile } from '@/lib/mappers';
import { ProfileEditModalClient } from './profile-edit-modal-client';

interface ProfileEditModalProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfileEditModal({ params }: ProfileEditModalProps) {
  const { username } = await params;

  // ユーザー情報を取得
  const user = await getUserByUsername(username);
  
  if (!user) {
    return null;
  }

  // 現在のログインユーザーIDを取得
  const currentUserId = await getCurrentUserId();
  
  // 表示しているユーザーが自分のプロフィールかどうかを判定
  const isOwnProfile = currentUserId === user.id;

  // 自分のプロフィールでない場合は何も表示しない
  if (!isOwnProfile) {
    return null;
  }

  // プロフィール情報をフォーマット
  const profile = formatUserProfile(user);

  return (
    <ProfileEditModalClient
      initialData={{
        displayName: profile.displayName,
        username: profile.username.replace('@', ''),
        bio: profile.bio,
        profileImageUrl: profile.avatar,
        coverImageUrl: profile.bannerImage,
      }}
    />
  );
}
