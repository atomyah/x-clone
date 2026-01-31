// プロフィール更新用のServer Actionsを実装

'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Clerkの認証情報からデータベースのユーザーIDを取得
 * @returns データベースのユーザーID（認証されていない場合はnull）
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return null;
    }

    // ClerkのIDからデータベースのユーザーを取得
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    return user?.id || null;
  } catch (error) {
    console.error('ユーザーID取得エラー:', error);
    return null;
  }
}

/**
 * プロフィール更新の状態型
 */
export type UpdateProfileState = {
  success: boolean;
  error?: string;
};

/**
 * useActionState用のプロフィール更新ServerAction
 * @param prevState 前回の状態
 * @param formData フォームデータ
 * @returns プロフィール更新結果の状態
 */
export async function updateProfile(
  prevState: UpdateProfileState | null,
  formData: FormData
): Promise<UpdateProfileState> {
  try {
    // 認証チェック
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        error: '認証が必要です。ログインしてください。',
      };
    }

    // フォームデータからプロフィール情報を取得
    const displayName = formData.get('displayName') as string;
    const bio = formData.get('bio') as string;

    // バリデーション
    const trimmedDisplayName = displayName?.trim();
    if (!trimmedDisplayName) {
      return {
        success: false,
        error: '表示名を入力してください。',
      };
    }

    if (trimmedDisplayName.length > 50) {
      return {
        success: false,
        error: '表示名は50文字以内で入力してください。',
      };
    }

    // 自己紹介の文字数チェック
    if (bio && bio.length > 500) {
      return {
        success: false,
        error: '自己紹介は500文字以内で入力してください。',
      };
    }

    // 既存のユーザーを取得
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });

    if (!currentUser) {
      return {
        success: false,
        error: 'ユーザーが見つかりません。',
      };
    }

    // プロフィールを更新（displayNameとbioのみ）
    const updateData = {
      displayName: trimmedDisplayName,
      bio: bio?.trim() || null,
    };

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // ページを再検証して最新のプロフィールを表示
    revalidatePath('/profile');
    revalidatePath(`/profile/${currentUser.username}`);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('プロフィール更新エラー:', error);
    
    // Prismaのエラーを処理
    if (error.code === 'P2002') {
      return {
        success: false,
        error: 'データベースエラーが発生しました。',
      };
    }

    return {
      success: false,
      error: 'プロフィールの更新に失敗しました。もう一度お試しください。',
    };
  }
}
