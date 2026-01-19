// 1. Data Access Layer (DAL) - lib/posts.ts, lib/users.ts
//     データベース操作のみを担当
//     Prismaクエリをカプセル化
//     型定義を明確化（PostWithUser, UserWithCounts）
// 2. Data Mapping Layer - lib/mappers.ts（新規作成）
//     データ変換ロジックを集約
//     Prisma型 → UI型への変換
//     再利用可能なマッパー関数
// 3. Presentation Layer - app/page.tsx, app/profile/[username]/page.tsx
//     UI表示のみを担当
//     データアクセスと変換はDAL/Mapperに委譲
//     レイヤー構造
// ┌─────────────────────────────────┐
// │  Presentation Layer             │
// │  (app/page.tsx, components)     │
// └──────────────┬──────────────────┘
//                │
// ┌──────────────▼──────────────────┐
// │  Mapping Layer                  │
// │  (lib/mappers.ts)               │
// └──────────────┬──────────────────┘
//                │
// ┌──────────────▼──────────────────┐
// │  Data Access Layer              │
// │  (lib/posts.ts, lib/users.ts)   │
// └──────────────┬──────────────────┘
//                │
// ┌──────────────▼──────────────────┐
// │  Database                       │
// │  (Prisma + Supabase)            │
// └─────────────────────────────────┘

import { prisma } from './prisma';
import { auth } from '@clerk/nextjs/server';
import type { Post as PrismaPost, User as PrismaUser } from '@prisma/client';

export type PostWithUser = PrismaPost & {
  user: PrismaUser;
  _count?: {
    likes: number;
    replies: number;
  };
  isLiked?: boolean; // 現在のユーザーがいいねしているかどうか
};

export type PostWithReplies = PostWithUser & {
  replies: PostWithUser[];
};

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
 * タイムライン用の投稿を取得
 * リプライを除外し、新しい順に並べる
 */
export async function getTimelinePosts(): Promise<PostWithUser[]> {
  try {
    const currentUserId = await getCurrentUserId();
    
    const posts = await prisma.post.findMany({
      where: {
        parentId: null, // リプライを除外
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // 最大50件
    });

    // 現在のユーザーがいいねしている投稿IDを取得
    let likedPostIds: string[] = [];
    if (currentUserId) {
      const likes = await prisma.like.findMany({
        where: {
          userId: currentUserId,
          postId: {
            in: posts.map(post => post.id),
          },
        },
        select: {
          postId: true,
        },
      });
      likedPostIds = likes.map(like => like.postId);
    }

    // 各投稿にisLikedフラグを追加
    return posts.map(post => ({
      ...post,
      isLiked: likedPostIds.includes(post.id),
    }));
  } catch (error) {
    console.error('投稿の取得に失敗しました:', error);
    return [];
  }
}

/**
 * 特定のユーザーの投稿を取得
 */
export async function getUserPosts(userId: string): Promise<PostWithUser[]> {
  try {
    const currentUserId = await getCurrentUserId();
    
    const posts = await prisma.post.findMany({
      where: {
        userId,
        parentId: null,
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 現在のユーザーがいいねしている投稿IDを取得
    let likedPostIds: string[] = [];
    if (currentUserId) {
      const likes = await prisma.like.findMany({
        where: {
          userId: currentUserId,
          postId: {
            in: posts.map(post => post.id),
          },
        },
        select: {
          postId: true,
        },
      });
      likedPostIds = likes.map(like => like.postId);
    }

    // 各投稿にisLikedフラグを追加
    return posts.map(post => ({
      ...post,
      isLiked: likedPostIds.includes(post.id),
    }));
  } catch (error) {
    console.error('ユーザー投稿の取得に失敗しました:', error);
    return [];
  }
}

/**
 * 投稿とリプライを取得
 */
export async function getPostWithReplies(postId: string): Promise<PostWithReplies | null> {
  try {
    const currentUserId = await getCurrentUserId();
    
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
            _count: {
              select: {
                likes: true,
                replies: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    // 現在のユーザーがいいねしている投稿IDを取得（メイン投稿とリプライ両方）
    const allPostIds = [post.id, ...post.replies.map(reply => reply.id)];
    let likedPostIds: string[] = [];
    if (currentUserId) {
      const likes = await prisma.like.findMany({
        where: {
          userId: currentUserId,
          postId: {
            in: allPostIds,
          },
        },
        select: {
          postId: true,
        },
      });
      likedPostIds = likes.map(like => like.postId);
    }

    // メイン投稿とリプライにisLikedフラグを追加
    return {
      ...post,
      isLiked: likedPostIds.includes(post.id),
      replies: post.replies.map(reply => ({
        ...reply,
        isLiked: likedPostIds.includes(reply.id),
      })),
    };
  } catch (error) {
    console.error('投稿の取得に失敗しました:', error);
    return null;
  }
}

