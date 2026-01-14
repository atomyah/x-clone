import { PostList } from '@/components/home/post-list';
import type { Post } from '@/types/post';

interface ProfileTimelineProps {
  posts: Post[];
}

export function ProfileTimeline({ posts }: ProfileTimelineProps) {
  return <PostList posts={posts} />;
}

