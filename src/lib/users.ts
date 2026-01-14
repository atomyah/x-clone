import { prisma } from './prisma';
import type { User } from '@prisma/client';

export type UserWithCounts = User & {
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
};

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

