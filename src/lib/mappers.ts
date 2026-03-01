
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


import type { PostWithUser, PostWithReplies as PrismaPostWithReplies } from './posts';
import type { UserWithCounts } from './users';
import type { Post, PostWithReplies } from '@/types/post';
import { formatRelativeTime } from './format-date';

function mapPostUser(post: PostWithUser) {
  return {
    name: post.user.displayName,
    username: `@${post.user.username}`,
    avatar: post.user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`,
  };
}

/**
 * PrismaのPostWithUser型をUI用のPost型に変換
 */
export function mapPostToUI(post: PostWithUser): Post {
  return {
    id: parseInt(post.id.substring(0, 8), 16), // UUIDの一部を数値IDに変換（表示用）
    uuid: post.id, // 元のUUIDを保持（詳細ページへのリンク用）
    user: mapPostUser(post),
    timestamp: formatRelativeTime(post.createdAt),
    createdAt: post.createdAt, // 元の日時を保持（詳細ページでの完全な日時表示用）
    content: post.content,
    quotedPost: post.quotedPost
      ? {
          uuid: post.quotedPost.id,
          user: {
            name: post.quotedPost.user.displayName,
            username: `@${post.quotedPost.user.username}`,
            avatar:
              post.quotedPost.user.profileImageUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.quotedPost.user.username}`,
          },
          timestamp: formatRelativeTime(post.quotedPost.createdAt),
          createdAt: post.quotedPost.createdAt,
          content: post.quotedPost.content,
        }
      : undefined,
    likes: post._count?.likes || 0,
    isLiked: post.isLiked || false, // 現在のユーザーがいいねしているかどうか
    retweets: 0, // リツイート機能は未実装
    replies: post._count?.replies || 0,
    views: Math.floor(Math.random() * 1000) + 100, // 仮の表示数（後でデータベースから取得）
  };
}

/**
 * PrismaのPostWithUser配列をUI用のPost配列に変換
 */
export function mapPostsToUI(posts: PostWithUser[]): Post[] {
  return posts.map(mapPostToUI);
}

/**
 * リプライを含む投稿をUI用の型に変換
 */
export function mapPostWithRepliesToUI(post: PrismaPostWithReplies): PostWithReplies {
  const mainPost = mapPostToUI(post);
  return {
    ...mainPost,
    replies: post.replies.map(mapPostToUI),
  };
}

/**
 * ユーザーのプロフィール情報をフォーマット
 */
export function formatUserProfile(user: UserWithCounts) {
  return {
    displayName: user.displayName,
    username: `@${user.username}`,
    avatar: user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
    bannerImage: user.coverImageUrl || undefined,
    bio: user.bio || undefined,
    joinedDate: new Date(user.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' }),
    postCount: user._count.posts,
    following: user._count.following,
    followers: user._count.followers,
  };
}
