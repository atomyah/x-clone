import { prisma } from './prisma';
import type { Post as PrismaPost, User as PrismaUser } from '@prisma/client';

export type PostWithUser = PrismaPost & {
  user: PrismaUser;
  _count?: {
    likes: number;
    replies: number;
  };
};

export type PostWithReplies = PostWithUser & {
  replies: PostWithUser[];
};

/**
 * タイムライン用の投稿を取得
 * リプライを除外し、新しい順に並べる
 */
export async function getTimelinePosts(): Promise<PostWithUser[]> {
  try {
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

    return posts;
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

    return posts;
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

    return post;
  } catch (error) {
    console.error('投稿の取得に失敗しました:', error);
    return null;
  }
}

