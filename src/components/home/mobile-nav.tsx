'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Home as HomeIcon,
  Search,
  Bell,
  Mail,
  UserCircle,
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: HomeIcon, label: 'ホーム', href: '/' },
    { icon: Search, label: '検索', href: '/search' },
    { icon: Bell, label: '通知', href: '/notifications' },
    { icon: Mail, label: 'メッセージ', href: '/messages' },
    { icon: UserCircle, label: 'プロフィール', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant="ghost"
              size="icon"
              className={`h-full w-full rounded-none ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}
              asChild
            >
              <Link href={item.href}>
                <Icon className="w-6 h-6" />
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

