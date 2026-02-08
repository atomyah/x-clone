/**
 * ========================================
 * Server Actions層（ユーザー関連の書き込み操作）
 * ========================================
 * 
 * 【役割】
 * - Client Componentsから呼び出されるデータ書き込み専用の関数群
 * - データベースへの更新・作成・削除（INSERT/UPDATE/DELETE操作）
 * - フォーム送信やボタンクリックなどのユーザー操作を処理
 * 
 * 【使用箇所】
 * - components/profile/profile-info.tsx（Client Component）→ toggleFollow
 * - components/profile/profile-edit-form.tsx（Client Component）→ updateProfile
 * - その他のClient Components
 * 
 * 【注意】
 * - 'use server'ディレクティブが必要（Server Actionsとして動作）
 * - Server Componentsからは直接呼び出さない（データ読み取りは lib/users.ts を使用）
 * - revalidatePath()でページの再検証を行う
 * 
 * 60.カバー画像のアップロード処理を追加
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadCoverImage } from '@/lib/storage';

/**
 * 【内部関数】Clerkの認証情報からデータベースのユーザーIDを取得
 * 
 * 注意: この関数は lib/users.ts にも同じ実装があるが、
 * Server Actions内で使用するため、ここにも定義している。
 * 
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
    const coverImage = formData.get('coverImage') as File | null;

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
      select: { username: true, coverImageUrl: true },
    });

    if (!currentUser) {
      return {
        success: false,
        error: 'ユーザーが見つかりません。',
      };
    }

    // カバー画像のアップロード処理
    let coverImageUrl: string | null | undefined = undefined;
    if (coverImage && coverImage.size > 0) {
      const uploadResult = await uploadCoverImage(coverImage, userId);
      if (uploadResult.error) {
        return {
          success: false,
          error: uploadResult.error,
        };
      }
      coverImageUrl = uploadResult.url;
    }

    // プロフィールを更新
    const updateData: {
      displayName: string;
      bio: string | null;
      coverImageUrl?: string | null;
    } = {
      displayName: trimmedDisplayName,
      bio: bio?.trim() || null,
    };

    // カバー画像がアップロードされた場合のみ更新
    if (coverImageUrl !== undefined) {
      updateData.coverImageUrl = coverImageUrl;
    }

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

/**
 * フォロー/アンフォローのServer Action
 * @param followingId フォローするユーザーのID
 * @returns フォロー操作の結果
 */
export async function toggleFollow(followingId: string): Promise<{ success: boolean; isFollowing: boolean; error?: string }> {
  try {
    // 認証チェック
    const followerId = await getCurrentUserId();
    if (!followerId) {
      return {
        success: false,
        isFollowing: false,
        error: '認証が必要です。ログインしてください。',
      };
    }

    // 自分自身をフォローできないようにチェック
    if (followerId === followingId) {
      return {
        success: false,
        isFollowing: false,
        error: '自分自身をフォローすることはできません。',
      };
    }

    // フォロー対象のユーザーが存在するか確認
    const followingUser = await prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true, username: true },
    });

    if (!followingUser) {
      return {
        success: false,
        isFollowing: false,
        error: 'ユーザーが見つかりません。',
      };
    }

    // 既にフォローしているか確認
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      // アンフォロー（フォローを解除）
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      
      // ページを再検証
      revalidatePath('/');
      revalidatePath(`/profile/${followingUser.username}`);
      
      return {
        success: true,
        isFollowing: false,
      };
    } else {
      // フォローを追加
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      
      // ページを再検証
      revalidatePath('/');
      revalidatePath(`/profile/${followingUser.username}`);
      
      return {
        success: true,
        isFollowing: true,
      };
    }
  } catch (error) {
    console.error('フォロー操作エラー:', error);
    return {
      success: false,
      isFollowing: false,
      error: 'フォロー操作に失敗しました。もう一度お試しください。',
    };
  }
}
