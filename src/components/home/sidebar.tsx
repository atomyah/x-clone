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
import { useFlyoutSidebarNav } from '@/hooks/use-flyout-sidebar-nav';
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

const flyoutPanelClass =
  'absolute z-50 bottom-full mb-2 left-0 min-w-[150px] rounded-xl border-0 bg-white p-1 dark:bg-white ' +
  'shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_14px_rgba(0,0,0,0.12),0_12px_32px_rgba(0,0,0,0.14)]';

const flyoutItemClass =
  'w-full text-left text-sm font-medium text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors block dark:text-zinc-900';

function useDismissOnOutsidePointer(open: boolean, setOpen: (v: boolean) => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', close, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, ref, setOpen]);
}

/** ナビの Link 行：スマホ想定のみパネル二段階。狭いPC＋マウスは Tooltip＋リンク直接クリック */
function CompactNavLinkItem({
  label,
  href,
  newTab,
  onLinkClick,
  buttonClassName,
  icon,
  lgText,
  lgSpanClassName = 'text-base transition-transform duration-200 group-hover:translate-x-0.5',
  isLg,
  supportsHover,
  useFlyoutNav,
}: {
  label: string;
  href: string;
  newTab?: boolean;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  buttonClassName: string;
  icon: React.ReactNode;
  lgText: string;
  lgSpanClassName?: string;
  isLg: boolean;
  supportsHover: boolean;
  useFlyoutNav: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismissOnOutsidePointer(open, setOpen, wrapRef);

  const inner = (
    <>
      {icon}
      <span className={`hidden lg:inline ${lgSpanClassName}`}>{lgText}</span>
    </>
  );

  const linkProps = {
    href,
    target: newTab ? ('_blank' as const) : undefined,
    rel: newTab ? ('noopener noreferrer' as const) : undefined,
    onClick: onLinkClick,
  };

  if (isLg) {
    return (
      <Button variant="ghost" className={buttonClassName} asChild>
        <Link {...linkProps}>{inner}</Link>
      </Button>
    );
  }

  if (useFlyoutNav) {
    return (
    <div ref={wrapRef} className="relative mb-0 w-full max-w-full flex justify-center lg:block">
      <Button
        type="button"
        variant="ghost"
        className={buttonClassName}
        onClick={() => setOpen((v) => !v)}
      >
        {inner}
      </Button>
      {open && (
        <div className={flyoutPanelClass}>
          <Link
            {...linkProps}
            className={flyoutItemClass}
            onClick={(e) => {
              onLinkClick?.(e);
              setOpen(false);
            }}
          >
            {label}
          </Link>
        </div>
      )}
    </div>
  );
  }

  if (supportsHover) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className={buttonClassName} asChild>
            <Link {...linkProps}>{inner}</Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div ref={wrapRef} className="relative mb-0 w-full max-w-full flex justify-center lg:block">
      <Button
        type="button"
        variant="ghost"
        className={buttonClassName}
        onClick={() => setOpen((v) => !v)}
      >
        {inner}
      </Button>
      {open && (
        <div className={flyoutPanelClass}>
          <Link
            {...linkProps}
            className={flyoutItemClass}
            onClick={(e) => {
              onLinkClick?.(e);
              setOpen(false);
            }}
          >
            {label}
          </Link>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const isLg = useIsLgSidebar();
  const supportsHover = useSupportsHover();
  const useFlyoutNav = useFlyoutSidebarNav();
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
        <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
          <span className="text-white dark:text-black font-black text-xl tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Y</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 w-full">
        <CompactNavLinkItem
          label="ホーム"
          href="/"
          buttonClassName="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/80 dark:hover:bg-sky-900/20 hover:shadow-sm hover:-translate-y-0.5"
          lgText="ホーム"
          lgSpanClassName="text-base font-medium transition-transform duration-200 group-hover:translate-x-0.5"
          icon={<HomeIcon className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />}
          isLg={isLg}
          supportsHover={supportsHover}
          useFlyoutNav={useFlyoutNav}
        />
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 text-gray-500"
        >
          <Bell className="size-5 lg:size-7 shrink-0 text-gray-300" />
          <span className="hidden lg:inline text-base text-gray-300">通知</span>
        </Button>
        <CompactNavLinkItem
          label="入会方法"
          href="/nyukai"
          newTab
          buttonClassName="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/80 dark:hover:bg-sky-900/20 hover:shadow-sm hover:-translate-y-0.5"
          lgText="入会方法"
          icon={<UserPlus className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />}
          isLg={isLg}
          supportsHover={supportsHover}
          useFlyoutNav={useFlyoutNav}
        />
        <CompactNavLinkItem
          label="退会方法"
          href="/taikai"
          newTab
          buttonClassName="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50/80 dark:hover:bg-rose-900/20 hover:shadow-sm hover:-translate-y-0.5"
          lgText="退会方法"
          icon={<UserMinus className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />}
          isLg={isLg}
          supportsHover={supportsHover}
          useFlyoutNav={useFlyoutNav}
        />
        <CompactNavLinkItem
          label="プロフィール"
          href={profileUrl}
          onLinkClick={handleProfileClick}
          buttonClassName="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/80 dark:hover:bg-sky-900/20 hover:shadow-sm hover:-translate-y-0.5"
          lgText="プロフィール"
          icon={<UserCircle className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />}
          isLg={isLg}
          supportsHover={supportsHover}
          useFlyoutNav={useFlyoutNav}
        />
        <CompactNavLinkItem
          label="お問い合わせ"
          href="/contact"
          buttonClassName="w-full justify-center lg:justify-start gap-4 h-10 lg:h-12 rounded-xl group transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/80 dark:hover:bg-sky-900/20 hover:shadow-sm hover:-translate-y-0.5"
          lgText="お問い合わせ"
          icon={<Mail className="size-5 lg:size-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />}
          isLg={isLg}
          supportsHover={supportsHover}
          useFlyoutNav={useFlyoutNav}
        />
      </nav>

      <div className="mt-16 flex flex-col w-full shrink-0 lg:items-stretch items-center">
      <SignedOut>
        <TopSignInCompact isLg={isLg} supportsHover={supportsHover} useFlyoutNav={useFlyoutNav} />
      </SignedOut>
      <SignedIn>
        <div className="relative mb-4 w-full max-w-full flex justify-center lg:block" ref={logoutMenuRef}>
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
          {isLogoutMenuOpen && (
            <div className={flyoutPanelClass}>
              <button
                type="button"
                className={flyoutItemClass}
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
        <AccountRowCompact
          isLg={isLg}
          supportsHover={supportsHover}
          useFlyoutNav={useFlyoutNav}
          displayName={displayName}
          username={username}
          isLoaded={isLoaded}
          userImageUrl={user?.imageUrl}
          firstInitial={user?.firstName?.[0]}
          emailInitial={user?.emailAddresses[0]?.emailAddress?.[0]}
          onOpenAccount={openClerkUserMenu}
        />
      </SignedIn>
      <SignedOut>
        <BottomSignInCompact isLg={isLg} supportsHover={supportsHover} useFlyoutNav={useFlyoutNav} />
      </SignedOut>
      </div>
    </aside>
    </TooltipProvider>
  );
}

function TopSignInCompact({
  isLg,
  supportsHover,
  useFlyoutNav,
}: {
  isLg: boolean;
  supportsHover: boolean;
  useFlyoutNav: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismissOnOutsidePointer(open, setOpen, wrapRef);

  const button = (
    <Button
      className="w-12 h-12 lg:w-full lg:h-12 rounded-full font-bold mb-4 text-sm lg:text-base justify-center p-0 lg:px-4 bg-zinc-800 text-white transition-colors duration-200 hover:bg-zinc-700 hover:shadow-md hover:shadow-zinc-900/20"
      type="button"
    >
      <LogIn className="size-5 lg:hidden" />
      <span className="hidden lg:inline">ログイン(あるいは入会)</span>
    </Button>
  );

  if (isLg) {
    return (
      <span className="inline-flex w-full justify-center lg:block">
        <SignInButton mode="modal">{button}</SignInButton>
      </span>
    );
  }

  if (useFlyoutNav) {
    return (
    <div ref={wrapRef} className="relative w-full max-w-full flex justify-center mb-4 lg:mb-0 lg:block">
      <span className="inline-flex w-full justify-center lg:block">
        <Button
          type="button"
          className="w-12 h-12 lg:w-full lg:h-12 rounded-full font-bold mb-0 lg:mb-4 text-sm lg:text-base justify-center p-0 lg:px-4 bg-zinc-800 text-white transition-colors duration-200 hover:bg-zinc-700 hover:shadow-md hover:shadow-zinc-900/20"
          onClick={() => setOpen((v) => !v)}
        >
          <LogIn className="size-5 lg:hidden" />
          <span className="hidden lg:inline">ログイン(あるいは入会)</span>
        </Button>
      </span>
      {open && (
        <div className={flyoutPanelClass}>
          <SignInButton mode="modal">
            <button type="button" className={flyoutItemClass} onClick={() => setOpen(false)}>
              ログイン／サインアップ
            </button>
          </SignInButton>
        </div>
      )}
    </div>
    );
  }

  if (supportsHover) {
    return (
      <span className="inline-flex w-full justify-center lg:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <SignInButton mode="modal">{button}</SignInButton>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            ログイン／サインアップ
          </TooltipContent>
        </Tooltip>
      </span>
    );
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-full flex justify-center mb-4 lg:mb-0 lg:block">
      <span className="inline-flex w-full justify-center lg:block">
        <Button
          type="button"
          className="w-12 h-12 lg:w-full lg:h-12 rounded-full font-bold mb-0 lg:mb-4 text-sm lg:text-base justify-center p-0 lg:px-4 bg-zinc-800 text-white transition-colors duration-200 hover:bg-zinc-700 hover:shadow-md hover:shadow-zinc-900/20"
          onClick={() => setOpen((v) => !v)}
        >
          <LogIn className="size-5 lg:hidden" />
          <span className="hidden lg:inline">ログイン(あるいは入会)</span>
        </Button>
      </span>
      {open && (
        <div className={flyoutPanelClass}>
          <SignInButton mode="modal">
            <button type="button" className={flyoutItemClass} onClick={() => setOpen(false)}>
              ログイン／サインアップ
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}

function AccountRowCompact({
  isLg,
  supportsHover,
  useFlyoutNav,
  displayName,
  username,
  isLoaded,
  userImageUrl,
  firstInitial,
  emailInitial,
  onOpenAccount,
}: {
  isLg: boolean;
  supportsHover: boolean;
  useFlyoutNav: boolean;
  displayName: string;
  username: string;
  isLoaded: boolean;
  userImageUrl?: string;
  firstInitial?: string;
  emailInitial?: string;
  onOpenAccount: () => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismissOnOutsidePointer(open, setOpen, wrapRef);

  const rowInner = (
    <>
      <div className="h-10 w-10 lg:h-14 lg:w-14 shrink-0 relative rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center group">
        <Avatar className="h-9 w-9 lg:h-12 lg:w-12 shrink-0 relative z-0 pointer-events-none transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:ring-2 group-hover:ring-primary/30">
          <AvatarImage src={userImageUrl} />
          <AvatarFallback>{firstInitial || emailInitial || 'U'}</AvatarFallback>
        </Avatar>
      </div>
      {isLoaded && (
        <>
          <div className="hidden lg:flex flex-col items-start text-sm flex-1">
            <span className="font-semibold">{displayName}</span>
            <span className="text-xs text-muted-foreground">@{username}</span>
          </div>
          <MoreHorizontal className="size-7 shrink-0 hidden lg:block" />
        </>
      )}
    </>
  );

  const rowClass =
    'w-full flex items-center gap-3 h-10 lg:h-16 rounded-full hover:bg-muted/50 px-2 lg:px-3 transition-colors';

  if (isLg) {
    return (
      <button
        type="button"
        className={rowClass}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenAccount();
        }}
      >
        {rowInner}
      </button>
    );
  }

  if (useFlyoutNav) {
    return (
      <div ref={wrapRef} className="relative w-full max-w-full flex justify-center lg:block">
        <button type="button" className={rowClass} onClick={() => setOpen((v) => !v)}>
          {rowInner}
        </button>
        {open && (
          <div className={flyoutPanelClass}>
            <button
              type="button"
              className={flyoutItemClass}
              onClick={() => {
                setOpen(false);
                onOpenAccount();
              }}
            >
              アカウント設定
            </button>
          </div>
        )}
      </div>
    );
  }

  if (supportsHover) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={rowClass}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenAccount();
            }}
          >
            {rowInner}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          アカウント設定
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-full flex justify-center lg:block">
      <button type="button" className={rowClass} onClick={() => setOpen((v) => !v)}>
        {rowInner}
      </button>
      {open && (
        <div className={flyoutPanelClass}>
          <button
            type="button"
            className={flyoutItemClass}
            onClick={() => {
              setOpen(false);
              onOpenAccount();
            }}
          >
            アカウント設定
          </button>
        </div>
      )}
    </div>
  );
}

function BottomSignInCompact({
  isLg,
  supportsHover,
  useFlyoutNav,
}: {
  isLg: boolean;
  supportsHover: boolean;
  useFlyoutNav: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismissOnOutsidePointer(open, setOpen, wrapRef);

  const inner = (
    <>
      <div className="flex items-center gap-3 flex-1 justify-center lg:justify-start group">
        <Avatar className="h-6 w-6 lg:h-9 lg:w-9 shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:ring-2 group-hover:ring-primary/30">
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className="hidden lg:flex flex-col items-start text-sm">
          <span className="font-semibold">ログイン</span>
          <span className="text-xs text-muted-foreground">アカウントにアクセス</span>
        </div>
      </div>
      <MoreHorizontal className="size-7 shrink-0 hidden lg:block" />
    </>
  );

  const btnClass =
    'w-full justify-center lg:justify-between h-10 lg:h-16 rounded-full hover:bg-muted/50';

  if (isLg) {
    return (
      <Button variant="ghost" className={btnClass} asChild>
        <Link href="/sign-in">{inner}</Link>
      </Button>
    );
  }

  if (useFlyoutNav) {
    return (
      <div ref={wrapRef} className="relative w-full max-w-full flex justify-center lg:block">
        <Button type="button" variant="ghost" className={btnClass} onClick={() => setOpen((v) => !v)}>
          {inner}
        </Button>
        {open && (
          <div className={flyoutPanelClass}>
            <Link href="/sign-in" className={flyoutItemClass} onClick={() => setOpen(false)}>
              ログイン
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (supportsHover) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className={btnClass} asChild>
            <Link href="/sign-in">{inner}</Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          ログイン
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-full flex justify-center lg:block">
      <Button type="button" variant="ghost" className={btnClass} onClick={() => setOpen((v) => !v)}>
        {inner}
      </Button>
      {open && (
        <div className={flyoutPanelClass}>
          <Link href="/sign-in" className={flyoutItemClass} onClick={() => setOpen(false)}>
            ログイン
          </Link>
        </div>
      )}
    </div>
  );
}