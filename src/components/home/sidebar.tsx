'use client';

import Link from 'next/link';
import { useUser, useAuth, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home as HomeIcon,
  Search,
  Bell,
  BookmarkIcon,
  UserCircle,
  MoreHorizontal,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'ユーザー'
    : 'ユーザー';

  const username = user?.username || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'username';

  // usernameから@を除去してプロフィールURLを生成
  const profileUrl = `/profile/${username.replace('@', '')}`;

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを防ぐ
  };

  return (
    <aside className={`w-[55px] lg:w-[230px] h-screen sticky top-0 px-1 lg:px-3 py-4 flex flex-col items-center lg:items-stretch shrink-0 ${className || ''}`}>
      <div className="flex items-center justify-center lg:justify-start gap-2 px-3 mb-8">
        <Link href="/" className="flex items-center justify-center">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center hover:bg-black/90 dark:hover:bg-white/90 transition-colors">
            <span className="text-white dark:text-black font-black text-xl tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Y</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 w-full">
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 hover:bg-muted/50"
          title="ホーム"
          asChild
        >
          <Link href="/">
            <HomeIcon className="size-5 lg:size-7 shrink-0" />
            <span className="hidden lg:inline text-base font-medium">ホーム</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 hover:bg-muted/50"
          title="話題を検索"
        >
          <Search className="size-5 lg:size-7 shrink-0" />
          <span className="hidden lg:inline text-base">話題を検索</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 hover:bg-muted/50"
          title="通知"
        >
          <Bell className="size-5 lg:size-7 shrink-0" />
          <span className="hidden lg:inline text-base">通知</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 hover:bg-muted/50"
          title="ブックマーク"
        >
          <BookmarkIcon className="size-5 lg:size-7 shrink-0" />
          <span className="hidden lg:inline text-base">ブックマーク</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 hover:bg-muted/50"
          title="プロフィール"
          asChild
        >
          <Link href={profileUrl} onClick={handleProfileClick}>
            <UserCircle className="size-5 lg:size-7 shrink-0" />
            <span className="hidden lg:inline text-base">プロフィール</span>
          </Link>
        </Button>
      </nav>

      <Button className="w-full h-10 lg:h-12 rounded-full font-bold mb-4 text-base lg:text-lg justify-center lg:justify-center"
              title="ポストする"
      >
        <span className="hidden lg:inline">ポストする</span>
        <span className="lg:hidden text-lg">+</span>
      </Button>

      <SignedIn>
        <div className="w-full relative">
          <button
            type="button"
            className="w-full flex items-center gap-3 h-10 lg:h-16 rounded-full hover:bg-muted/50 px-2 lg:px-3 transition-colors"
            onClick={(e) => {
              const userButtonTrigger = e.currentTarget.querySelector('[data-clerk-element="userButtonTrigger"]') as HTMLElement;
              if (userButtonTrigger) {
                userButtonTrigger.click();
              }
            }}
          >
            <div className="shrink-0">
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "h-7 w-7 lg:h-10 lg:w-10",
                    userButtonTrigger: "h-7 w-7 lg:h-10 lg:w-10 rounded-full",
                    userButtonPopoverCard: "shadow-lg",
                    userButtonPopoverActions: "p-2",
                    userButtonPopoverActionButton: "hover:bg-muted rounded-md",
                  },
                }}
              />
            </div>
            {isLoaded && (
              <>
                <div className="hidden lg:flex flex-col items-start text-sm flex-1 pointer-events-none">
                  <span className="font-semibold">{displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    @{username}
                  </span>
                </div>
                <MoreHorizontal className="size-7 shrink-0 hidden lg:block pointer-events-none" />
              </>
            )}
          </button>
        </div>
      </SignedIn>
      <SignedOut>
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-between h-10 lg:h-16 rounded-full hover:bg-muted/50"
          title="ログイン"
          asChild
        >
          <Link href="/sign-in">
            <div className="flex items-center gap-3 flex-1 justify-center lg:justify-start">
              <Avatar className="h-7 w-7 lg:h-10 lg:w-10 shrink-0">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start text-sm">
                <span className="font-semibold">ログイン</span>
                <span className="text-xs text-muted-foreground">
                  アカウントにアクセス
                </span>
              </div>
            </div>
            <MoreHorizontal className="size-7 shrink-0 hidden lg:block" />
          </Link>
        </Button>
      </SignedOut>
    </aside>
  );
}

