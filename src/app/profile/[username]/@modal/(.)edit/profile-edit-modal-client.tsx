// app/profile/[username]/@modal/(.)edit/page.tsxで呼ばれるProfileEditModalClientコンポーネント

'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileEditForm } from '@/components/profile/profile-edit-form';

interface ProfileEditModalClientProps {
  initialData: {
    displayName: string;
    username: string;
    bio?: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
  };
}

export function ProfileEditModalClient({ initialData }: ProfileEditModalClientProps) {
  const router = useRouter();

  const handleSuccess = () => {
    router.back();
    router.refresh();
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <ProfileEditForm
            initialData={initialData}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
