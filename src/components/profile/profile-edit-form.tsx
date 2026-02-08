// プロフィール編集フォームコンポーネント
// useActionStateを使用したフォーム実装
// app/profile/[username]/@modal/(.)edit/page.tsxで呼ばれる

'use client';

import { useActionState, useEffect, useRef, useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateProfile, type UpdateProfileState } from '@/lib/actions/users';
import { X, Camera } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // カバー画像のプレビュー状態
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    initialData.coverImageUrl || null
  );
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

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

  // ファイル選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック（5MB制限）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('画像サイズは5MB以下にしてください。');
        return;
      }

      // ファイルタイプチェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('JPEG、PNG、WebP形式の画像のみアップロードできます。');
        return;
      }

      setCoverImageFile(file);
      
      // プレビュー用のURLを生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // カバー画像を削除
  const handleRemoveCoverImage = () => {
    setCoverImagePreview(null);
    setCoverImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // カバー画像が選択されている場合は追加
    if (coverImageFile) {
      formData.append('coverImage', coverImageFile);
    }
    
    // startTransition内でformActionを呼び出す
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* カバー画像 */}
      <div className="space-y-2">
        <label htmlFor="coverImage" className="text-sm font-medium">
          カバー画像
        </label>
        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border border-input">
          {coverImagePreview ? (
            <>
              {/* base64データURLの場合は通常のimgタグを使用 */}
              {coverImagePreview.startsWith('data:') ? (
                <img
                  src={coverImagePreview}
                  alt="カバー画像プレビュー"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={coverImagePreview}
                  alt="カバー画像プレビュー"
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/90 hover:bg-white text-black"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  変更
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveCoverImage}
                  className="bg-white/90 hover:bg-white text-destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  削除
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Camera className="w-8 h-8" />
                <span className="text-sm font-medium">カバー画像を追加</span>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">
          JPEG、PNG、WebP形式、5MB以下の画像をアップロードできます
        </p>
      </div>

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
