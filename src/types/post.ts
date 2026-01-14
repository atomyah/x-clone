export interface User {
  name: string;
  username: string;
  avatar: string;
}

export interface Post {
  id: number;
  uuid?: string; // データベースのUUID（詳細ページへのリンク用）
  user: User;
  timestamp: string;
  createdAt?: Date | string; // 元の日時（詳細ページでの完全な日時表示用）
  content: string;
  images?: string[];
  hasLink?: boolean;
  link?: string;
  likes: number;
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

