// リポスト用モーダル画面

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { cn } from '@/lib/utils';
import { createQuoteRepost, type CreateQuoteRepostState } from '@/lib/actions/posts';

const initialState: CreateQuoteRepostState | null = null;

interface QuoteRepostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotedPostId: string;
  quotedToUsername: string;
  quotedToName: string;
  quotedToContent: string;
  quotedToAvatar?: string;
}

export function QuoteRepostModal({
  open,
  onOpenChange,
  quotedPostId,
  quotedToUsername,
  quotedToName,
  quotedToContent,
  quotedToAvatar,
}: QuoteRepostModalProps) {
  const [state, formAction, isPending] = useActionState<CreateQuoteRepostState | null, FormData>(
    createQuoteRepost,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
      onOpenChange(false);
      router.refresh();
    }
  }, [state?.success, onOpenChange, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      openSignIn({
        redirectUrl: window.location.href,
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    textarea.value = newText;
    const newCursorPos = start + emoji.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={handleClose}
      />
      <div
        className={cn(
          'relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0a0a0a] text-foreground rounded-lg shadow-xl border border-border animate-in fade-in-0 zoom-in-95 duration-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-4">
          <form ref={formRef} action={formAction} onSubmit={handleSubmit}>
            <input type="hidden" name="quotedPostId" value={quotedPostId} />

            <div className="flex gap-3 items-start">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user?.imageUrl || undefined} />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  name="content"
                  className="w-full min-h-[120px] resize-none bg-transparent text-lg placeholder:text-muted-foreground focus:outline-none mb-3"
                  placeholder="コメントを追加"
                />

                <div className="mb-3 rounded-xl border border-border p-3">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={quotedToAvatar} />
                      <AvatarFallback>{quotedToName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{quotedToName}</span>
                        <span className="text-xs text-muted-foreground">{quotedToUsername}</span>
                      </div>
                      <p className="text-sm text-foreground wrap-break-word">{quotedToContent}</p>
                    </div>
                  </div>
                </div>

                {state?.error && (
                  <div className="mb-2 text-sm text-destructive">
                    {state.error}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </div>
                  <Button
                    type="submit"
                    className="rounded-full font-bold px-4 h-9 text-sm shrink-0 disabled:opacity-50"
                    disabled={isPending}
                  >
                    {isPending ? 'リポスト中...' : 'リポストする'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
