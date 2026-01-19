// Server Actionsでデータベースを更新する
// toggleLike関数はpost-item.tsxで使用されている。

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
 * 投稿作成の状態型
 */
export type CreatePostState = {
  success: boolean;
  postId?: string;
  error?: string;
};

/**
 * useActionState用の投稿作成ServerAction
 * @param prevState 前回の状態
 * @param formData フォームデータ
 * @returns 投稿作成結果の状態
 */
export async function createPost(
  prevState: CreatePostState | null,
  formData: FormData
): Promise<CreatePostState> {
  try {
    // 認証チェック
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        error: '認証が必要です。ログインしてください。',
      };
    }

    // フォームデータから投稿内容を取得
    const content = formData.get('content') as string;
    
    // バリデーション
    const trimmedContent = content?.trim();
    if (!trimmedContent) {
      return {
        success: false,
        error: '投稿内容を入力してください。',
      };
    }

    if (trimmedContent.length > 1000) {
      return {
        success: false,
        error: '投稿内容は1,000文字以内で入力してください。',
      };
    }

    // 投稿を作成
    const post = await prisma.post.create({
      data: {
        content: trimmedContent,
        userId,
      },
      select: {
        id: true,
      },
    });

    // ページを再検証して最新の投稿を表示（画面更新しなければならないのでなんだかキャッシュの操作だが必要。
    revalidatePath('/');

    return {
      success: true,
      postId: post.id,
    };
  } catch (error) {
    console.error('投稿作成エラー:', error);
    return {
      success: false,
      error: '投稿に失敗しました。もう一度お試しください。',
    };
  }
}

/**
 * いいね/いいね解除のServer Action
 * @param postId 投稿ID
 * @returns いいね操作の結果
 */
// toggleLike関数はpost-item.tsxで使用されている。
export async function toggleLike(postId: string): Promise<{ success: boolean; isLiked: boolean; error?: string }> {
  try {
    // 認証チェック
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        isLiked: false,
        error: '認証が必要です。ログインしてください。',
      };
    }

    // 既にいいねしているか確認
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // いいねを解除
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      
      // ページを再検証
      revalidatePath('/');
      revalidatePath(`/posts/${postId}`);
      
      return {
        success: true,
        isLiked: false,
      };
    } else {
      // いいねを追加
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      
      // ページを再検証
      revalidatePath('/');
      revalidatePath(`/posts/${postId}`);
      
      return {
        success: true,
        isLiked: true,
      };
    }
  } catch (error) {
    console.error('いいね操作エラー:', error);
    return {
      success: false,
      isLiked: false,
      error: 'いいね操作に失敗しました。もう一度お試しください。',
    };
  }
}
