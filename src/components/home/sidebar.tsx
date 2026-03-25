'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { useUser, useAuth, SignedIn, SignedOut, SignInButton, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsLgSidebar } from '@/hooks/use-is-lg-sidebar';
import { useSupportsHover } from '@/hooks/use-supports-hover';
import {
  Home as HomeIcon,
  Bell,
  UserCircle,
  UserPlus,
  UserMinus,
  Mail,
  MoreHorizontal,
  LogIn,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const LONG_PRESS_MS = 380;
const MOVE_CANCEL_PX2 = 100;
const TOUCH_HINT_CLOSE_MS = 2400;

function TouchLongPressTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressNextClickRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const clearLongPressTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleAutoClose = () => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    autoCloseRef.current = setTimeout(() => setOpen(false), TOUCH_HINT_CLOSE_MS);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && autoCloseRef.current) {
      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
  }, []);

  return (
    <span
      className="block w-full min-w-0"
      onPointerDownCapture={(e) => {
        if (e.pointerType !== 'touch') return;
        touchStartRef.current = { x: e.clientX, y: e.clientY };
        suppressNextClickRef.current = false;
        clearLongPressTimer();
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          suppressNextClickRef.current = true;
          setOpen(true);
          scheduleAutoClose();
        }, LONG_PRESS_MS);
      }}
      onPointerMoveCapture={(e) => {
        if (e.pointerType !== 'touch' || !timerRef.current || !touchStartRef.current) return;
        const dx = e.clientX - touchStartRef.current.x;
        const dy = e.clientY - touchStartRef.current.y;
        if (dx * dx + dy * dy > MOVE_CANCEL_PX2) {
          clearLongPressTimer();
          touchStartRef.current = null;
        }
      }}
      onPointerUpCapture={(e) => {
        if (e.pointerType === 'touch') {
          clearLongPressTimer();
          touchStartRef.current = null;
        }
      }}
      onPointerCancelCapture={() => {
        clearLongPressTimer();
        touchStartRef.current = null;
      }}
      onClickCapture={(e) => {
        if (suppressNextClickRef.current) {
          e.preventDefault();
          e.stopPropagation();
          suppressNextClickRef.current = false;
        }
      }}
    >
      <Tooltip open={open} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {label}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}

function SidebarIconTooltip({
  label,
  isLg,
  children,
}: {
  label: string;
  isLg: boolean;
  children: React.ReactElement;
}) {
  const supportsHover = useSupportsHover();
  if (isLg) return children;

  if (supportsHover) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return <TouchLongPressTooltip label={label}>{children}</TouchLongPressTooltip>;
}

export function Sidebar({ className }: SidebarProps) {
  const isLg = useIsLgSidebar();
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const logoutMenuRef = useRef<HTMLDivElement>(null);

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'ユーザー'
    : 'ユーザー';

  const username = user?.username || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'username';

  // 未ログイン・Clerk 読み込み中は /profile（ログイン案内）。ログイン済みは実ユーザー名の URL
  const profileUrl =
    isSignedIn && isLoaded && user
      ? `/profile/${username.replace('@', '')}`
      : '/profile';

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
    <TooltipProvider delayDuration={200}>
    <aside className={`w-[55px] lg:w-[230px] h-[calc(100dvh-9rem)] max-h-[calc(100dvh-9rem)] sticky top-0 px-1 lg:px-3 py-4 flex flex-col items-center lg:items-stretch shrink-0 ${className || ''}`}>
      <div className="flex items-center justify-center lg:justify-start gap-2 px-3 mb-8">
        <SidebarIconTooltip label="ホーム" isLg={isLg}>
          <Link href="/" className="flex items-center justify-center">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center hover:bg-black/90 dark:hover:bg-white/90 transition-colors">
              <span className="text-white dark:text-black font-black text-xl tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Y</span>
            </div>
          </Link>
        </SidebarIconTooltip>
      </div>

      <nav className="flex-1 space-y-2 w-full">
        <SidebarIconTooltip label="ホーム" isLg={isLg}>
          <Button
            variant="ghost"
            className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/80 dark:hover:bg-sky-900/20 hover:shadow-sm hover:-translate-y-0.5"
            asChild
          >
            <Link href="/">
              <HomeIcon className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:inline text-base font-medium transition-transform duration-200 group-hover:translate-x-0.5">ホーム</span>
            </Link>
          </Button>
        </SidebarIconTooltip>
        <SidebarIconTooltip label="通知" isLg={isLg}>
          <Button
            variant="ghost"
            className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 text-gray-500"
          >
            <Bell className="size-5 lg:size-7 shrink-0 text-gray-300" />
            <span className="hidden lg:inline text-base text-gray-300">通知</span>
          </Button>
        </SidebarIconTooltip>
        <SidebarIconTooltip label="入会方法" isLg={isLg}>
          <Button
            variant="ghost"
            className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/80 dark:hover:bg-sky-900/20 hover:shadow-sm hover:-translate-y-0.5"
            asChild
          >
            <Link href="/nyukai" target="_blank" rel="noopener noreferrer">
              <UserPlus className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:inline text-base transition-transform duration-200 group-hover:translate-x-0.5">入会方法</span>
            </Link>
          </Button>
        </SidebarIconTooltip>
        <SidebarIconTooltip label="退会方法" isLg={isLg}>
          <Button
            variant="ghost"
            className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50/80 dark:hover:bg-rose-900/20 hover:shadow-sm hover:-translate-y-0.5"
            asChild
          >
            <Link href="/taikai" target="_blank" rel="noopener noreferrer">
              <UserMinus className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:inline text-base transition-transform duration-200 group-hover:translate-x-0.5">退会方法</span>
            </Link>
          </Button>
        </SidebarIconTooltip>
        <SidebarIconTooltip label="プロフィール" isLg={isLg}>
          <Button
            variant="ghost"
            className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/80 dark:hover:bg-sky-900/20 hover:shadow-sm hover:-translate-y-0.5"
            asChild
          >
            <Link href={profileUrl} onClick={handleProfileClick}>
              <UserCircle className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:inline text-base transition-transform duration-200 group-hover:translate-x-0.5">プロフィール</span>
            </Link>
          </Button>
        </SidebarIconTooltip>
        <SidebarIconTooltip label="お問い合わせ" isLg={isLg}>
          <Button
            variant="ghost"
            className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/80 dark:hover:bg-sky-900/20 hover:shadow-sm hover:-translate-y-0.5"
            asChild
          >
            <Link href="/contact">
              <Mail className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:inline text-base transition-transform duration-200 group-hover:translate-x-0.5">お問い合わせ</span>
            </Link>
          </Button>
        </SidebarIconTooltip>
      </nav>

      <div className="mt-16 flex flex-col w-full shrink-0 lg:items-stretch items-center">
      <SignedOut>
        <SidebarIconTooltip label="ログイン／サインアップ" isLg={isLg}>
          <span className="inline-flex w-full justify-center lg:block">
            <SignInButton mode="modal">
              <Button
                className="w-12 h-12 lg:w-full lg:h-12 rounded-full font-bold mb-4 text-sm lg:text-base justify-center p-0 lg:px-4 bg-zinc-800 text-white transition-colors duration-200 hover:bg-zinc-700 hover:shadow-md hover:shadow-zinc-900/20"
                type="button"
              >
                <LogIn className="size-5 lg:hidden" />
                <span className="hidden lg:inline">ログイン(あるいは入会)</span>
              </Button>
            </SignInButton>
          </span>
        </SidebarIconTooltip>
      </SignedOut>
      <SignedIn>
        <div className="relative mb-4 w-full max-w-full flex justify-center lg:block" ref={logoutMenuRef}>
          <SidebarIconTooltip label="ログアウト" isLg={isLg}>
            <Button
              className="w-12 h-12 lg:w-full lg:h-12 rounded-full font-bold text-sm lg:text-base justify-center p-0 lg:px-4 bg-zinc-800 text-white transition-colors duration-200 hover:bg-zinc-700 hover:shadow-md hover:shadow-zinc-900/20 shrink-0"
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
          </SidebarIconTooltip>
          {isLogoutMenuOpen && (
            <div className="absolute z-50 bottom-full mb-2 left-0 min-w-[150px] rounded-xl bg-background shadow-xl shadow-black/20 dark:shadow-black/50 p-1">
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
        <SidebarIconTooltip label="アカウント設定" isLg={isLg}>
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
        </SidebarIconTooltip>
      </SignedIn>
      <SignedOut>
        <SidebarIconTooltip label="ログイン" isLg={isLg}>
          <Button
            variant="ghost"
            className="w-full justify-center lg:justify-between h-10 lg:h-16 rounded-full hover:bg-muted/50"
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
        </SidebarIconTooltip>
      </SignedOut>
      </div>
    </aside>
    </TooltipProvider>
  );
}

