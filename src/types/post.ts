export interface User {
  name: string;
  username: string;
  avatar: string;
}

export interface QuotedPost {
  uuid?: string;
  user: User;
  timestamp: string;
  createdAt?: Date | string;
  content: string;
}

export interface Post {
  id: number;
  uuid?: string; // データベースのUUID（詳細ページへのリンク用）
  user: User;
  timestamp: string;
  createdAt?: Date | string; // 元の日時（詳細ページでの完全な日時表示用）
  content: string;
  quotedPost?: QuotedPost;
  images?: string[];
  hasLink?: boolean;
  link?: string;
  likes: number;
  isLiked?: boolean; // 現在のユーザーがいいねしているかどうか
  retweets: number;
  replies: number;
  pinned?: boolean;
  views?: number; // 表示数
}

export interface PostWithReplies extends Omit<Post, 'replies'> {
  replies: Post[];
}

export interface LiveEvent {
  id: number;
  user: string;
  status: string;
  title: string;
  participants: string[];
  count: number;
}

export interface NewsItem {
  id: number;
  title: string;
  status: string;
  verified?: boolean;
}

