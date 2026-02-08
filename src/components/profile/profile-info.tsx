// プロフィール詳細情報ページ用コンポーネント
// app/profile/[username]/page.tsxで呼ばれるProfileInfoコンポーネント
// （カバー画像からフォロー数表示部までのコンポーネント. その上の{displayName}と{postCount} 件のポストの所はProfileHeaderコンポーネント）
// 58.フォロー・アンフォロー機能を実装でtoggleFollowを呼び出している。

'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Link as LinkIcon, Calendar } from 'lucide-react';
import { toggleFollow } from '@/lib/actions/users';

interface ProfileInfoProps {
  bannerImage?: string;
  avatar: string;
  name: string;
  username: string;
  verified?: boolean;
  bio?: string;
  website?: string;
  joinedDate?: string;
  following: number;
  followers: number;
  isOwnProfile?: boolean;
  userId: string;
  isFollowing: boolean;
}

export function ProfileInfo({
  bannerImage = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1200',
  avatar,
  name,
  username,
  verified = false,
  bio,
  website,
  joinedDate, // [username]/page.tsxの６５行目：joinedDate={new Date(user.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
  following,
  followers,
  isOwnProfile = false,
  userId,
  isFollowing: initialIsFollowing,
}: ProfileInfoProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(async () => {
      const result = await toggleFollow(userId);
      if (result.success) {
        setIsFollowing(result.isFollowing);
      }
    });
  };
  return (
    <div className="relative">
      {/* カバー画像 */}
      <div className="w-full h-32 md:h-48 bg-muted relative">
        <Image
          src={bannerImage}
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* プロフィール写真と編集ボタン */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-12 md:-mt-16 mb-4">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          {isOwnProfile ? (
            <Button
              variant="outline"
              className="rounded-full font-bold h-9 px-3 md:px-4 text-sm md:text-base"
              asChild
            >
              <Link href={`/profile/${username.replace('@', '')}/edit`}>
                プロフィールを編集
              </Link>
            </Button>
          ) : (
            <Button
              onClick={handleFollow}
              disabled={isPending}
              variant={isFollowing ? 'outline' : 'default'}
              className="rounded-full font-bold h-9 px-3 md:px-4 text-sm md:text-base"
            >
              {isPending ? '処理中...' : isFollowing ? 'フォロー中' : 'フォロー'}
            </Button>
          )}
        </div>

        {/* プロフィール情報 */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">{name}</h1>
              {verified && (
                <Check className="w-5 h-5 text-blue-500 fill-blue-500" />
              )}
            </div>
            <p className="text-muted-foreground text-sm">{username}</p>
          </div>

          {bio && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
          )}

          {/* 詳細情報 */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {joinedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{joinedDate}からXを利用しています</span>
              </div>
            )}
          </div>

          {/* フォロー/フォロワー数 */}
          <div className="flex gap-4 text-sm">
            <a
              href="#"
              className="hover:underline"
            >
              <span className="font-semibold">{following.toLocaleString()}</span>
              <span className="text-muted-foreground"> フォロー中</span>
            </a>
            <a
              href="#"
              className="hover:underline"
            >
              <span className="font-semibold">{followers.toLocaleString()}</span>
              <span className="text-muted-foreground"> フォロワー</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

