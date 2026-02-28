'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useUser, useAuth, SignedIn, SignedOut, SignInButton, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home as HomeIcon,
  Search,
  Bell,
  BookmarkIcon,
  UserCircle,
  MoreHorizontal,
  LogIn,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const logoutMenuRef = useRef<HTMLDivElement>(null);

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'ユーザー'
    : 'ユーザー';

  const username = user?.username || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'username';

  // usernameから@を除去してプロフィールURLを生成
  const profileUrl = `/profile/${username.replace('@', '')}`;

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを防ぐ
  };

  const openClerkUserMenu = () => {
    clerk.openUserProfile();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!logoutMenuRef.current) return;
      if (!logoutMenuRef.current.contains(event.target as Node)) {
        setIsLogoutMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLogoutMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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

      <SignedOut>
        <SignInButton mode="modal">
          <Button
            className="w-12 h-12 lg:w-full lg:h-12 rounded-full font-bold mb-4 text-sm lg:text-base justify-center p-0 lg:px-4 bg-zinc-800 text-white transition-colors duration-200 hover:bg-zinc-700 hover:shadow-md hover:shadow-zinc-900/20"
            title="ログイン／サインアップ"
            type="button"
          >
            <LogIn className="size-5 lg:hidden" />
            <span className="hidden lg:inline">ログイン(あるいは入会)</span>
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="relative mb-4" ref={logoutMenuRef}>
          <Button
            className="w-12 h-12 lg:w-full lg:h-12 rounded-full font-bold text-sm lg:text-base justify-center p-0 lg:px-4 bg-zinc-800 text-white transition-colors duration-200 hover:bg-zinc-700 hover:shadow-md hover:shadow-zinc-900/20"
            title="ログアウト"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLogoutMenuOpen((prev) => !prev);
            }}
          >
            <LogOut className="size-5 lg:hidden" />
            <span className="hidden lg:inline">ログアウト</span>
          </Button>
          {isLogoutMenuOpen && (
            <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 min-w-[150px] rounded-xl bg-background shadow-xl shadow-black/20 dark:shadow-black/50 p-1">
              <button
                type="button"
                className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors"
                onClick={() => {
                  setIsLogoutMenuOpen(false);
                  clerk.signOut();
                }}
              >
                ログアウトする
              </button>
            </div>
          )}
        </div>
      </SignedIn>

      <SignedIn>
        <button
          type="button"
          className="w-full flex items-center gap-3 h-10 lg:h-16 rounded-full hover:bg-muted/50 px-2 lg:px-3 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openClerkUserMenu();
          }}
        >
          <div className="h-10 w-10 lg:h-14 lg:w-14 shrink-0 relative rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center group">
            <Avatar className="h-9 w-9 lg:h-12 lg:w-12 shrink-0 relative z-0 pointer-events-none transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:ring-2 group-hover:ring-primary/30">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          {isLoaded && (
            <>
              <div className="hidden lg:flex flex-col items-start text-sm flex-1">
                <span className="font-semibold">{displayName}</span>
                <span className="text-xs text-muted-foreground">
                  @{username}
                </span>
              </div>
              <MoreHorizontal className="size-7 shrink-0 hidden lg:block" />
            </>
          )}
        </button>
      </SignedIn>
      <SignedOut>
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-between h-10 lg:h-16 rounded-full hover:bg-muted/50"
          title="ログイン"
          asChild
        >
          <Link href="/sign-in">
            <div className="flex items-center gap-3 flex-1 justify-center lg:justify-start group">
              <Avatar className="h-6 w-6 lg:h-9 lg:w-9 shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:ring-2 group-hover:ring-primary/30">
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

