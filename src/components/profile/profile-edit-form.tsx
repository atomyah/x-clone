// プロフィール編集フォームコンポーネント
// useActionStateを使用したフォーム実装
// app/profile/[username]/@modal/(.)edit/page.tsxで呼ばれる

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateProfile, type UpdateProfileState } from '@/lib/actions/users';

interface ProfileEditFormProps {
  initialData: {
    displayName: string;
    username: string;
    bio?: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
  };
  onSuccess?: () => void;
}

const initialState: UpdateProfileState | null = null;

export function ProfileEditForm({ initialData, onSuccess }: ProfileEditFormProps) {
  const [state, formAction, isPending] = useActionState<UpdateProfileState | null, FormData>(
    updateProfile,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // 更新成功時の処理
  useEffect(() => {
    if (state?.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        // フォームをリセットしてページを更新
        router.refresh();
      }
    }
  }, [state?.success, router, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* 表示名 */}
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">
          表示名
        </label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          defaultValue={initialData.displayName}
          placeholder="表示名を入力"
          maxLength={50}
          required
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          50文字以内で入力してください
        </p>
      </div>

      {/* 自己紹介 */}
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          自己紹介
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={initialData.bio || ''}
          placeholder="自己紹介を入力"
          maxLength={500}
          rows={4}
          className="w-full min-h-[100px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">
          500文字以内で入力してください
        </p>
      </div>

      {/* エラーメッセージ */}
      {state?.error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {state.error}
        </div>
      )}

      {/* 成功メッセージ */}
      {state?.success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
          プロフィールを更新しました
        </div>
      )}

      {/* ボタン */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? '更新中...' : '保存'}
        </Button>
      </div>
    </form>
  );
}
