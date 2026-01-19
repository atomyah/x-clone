import { prisma } from './prisma';
import { auth } from '@clerk/nextjs/server';
import type { User } from '@prisma/client';

export type UserWithCounts = User & {
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
};

/**
 * Clerkの認証情報からデータベースのユーザーIDを取得
 * @returns データベースのユーザーID（認証されていない場合はnull）
 */
export async function getCurrentUserId(): Promise<string | null> {
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
 * usernameでユーザー情報を取得
 * @param username ユーザー名（@なし）
 * @returns ユーザー情報（存在しない場合はnull）
 */
export async function getUserByUsername(username: string): Promise<UserWithCounts | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return null;
  }
}

