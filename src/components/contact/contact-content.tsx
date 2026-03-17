'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ContactForm } from './contact-form';

export function ContactContent() {
  return (
    <>
      <SignedIn>
        <ContactForm />
      </SignedIn>
      <SignedOut>
        <div className="space-y-4 py-8 text-center">
          <p className="text-muted-foreground">
            お問い合わせにはログインが必要です。
          </p>
          <SignInButton mode="modal">
            <Button type="button">
              ログインする
            </Button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
