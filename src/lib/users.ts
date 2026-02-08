/**
 * ========================================
 * データアクセス層（DAL: Data Access Layer）
 * ========================================
 * 
 * 【役割】
 * - Server Componentsから呼び出されるデータ読み取り専用の関数群
 * - データベースからの情報取得（SELECT操作）
 * - 認証情報の取得
 * 
 * 【使用箇所】
 * - app/profile/[username]/page.tsx（Server Component）
 * - app/profile/[username]/edit/page.tsx（Server Component）
 * - その他のServer Components
 * 
 * 【注意】
 * - Client Componentsからは直接呼び出さない
 * - データの書き込み（INSERT/UPDATE/DELETE）は lib/actions/users.ts を使用
 */

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

/**
 * 現在のユーザーが指定したユーザーをフォローしているかどうかを確認
 * @param followingId フォロー対象のユーザーID
 * @param followerId フォローするユーザーID（現在のユーザー）
 * @returns フォローしている場合はtrue、していない場合はfalse
 */
export async function isFollowing(followingId: string, followerId: string | null): Promise<boolean> {
  if (!followerId) {
    return false;
  }

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { // @@id([followerId, followingId])のこと → Prismaスキーマで定義した複合主キー
          followerId,
          followingId,
        },
      },
    });
    return !!follow;
  } catch (error) {
    console.error('フォロー状態確認エラー:', error);
    return false;
  }
}
