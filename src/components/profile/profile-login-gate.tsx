'use client';

import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function ProfileLoginGate() {
  return (
    <div className="space-y-4 py-8 text-center">
      <p className="text-muted-foreground">
        プロフィールを作成するにはログインが必要です。
      </p>
      <SignInButton mode="modal">
        <Button type="button">ログインする</Button>
      </SignInButton>
    </div>
  );
}
