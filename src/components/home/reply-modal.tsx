// 59.返信ボックスに対して返信ができないため、返信アイコンをクリックするとモーダルが表示されそこで返信を行う.

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { createReply, type CreateReplyState } from '@/lib/actions/posts';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const initialState: CreateReplyState | null = null;

interface ReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  replyToUsername: string;
  replyToName: string;
  replyToContent: string;
  replyToAvatar?: string;
}

export function ReplyModal({
  open,
  onOpenChange,
  postId,
  replyToUsername,
  replyToName,
  replyToContent,
  replyToAvatar,
}: ReplyModalProps) {
  const [state, formAction, isPending] = useActionState<CreateReplyState | null, FormData>(
    createReply,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  // 返信成功時にフォームをリセットしてモーダルを閉じる
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
      onOpenChange(false);
      // ページを再検証（revalidatePathはServer Action内で実行済み）
      router.refresh();
    }
  }, [state?.success, onOpenChange, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      openSignIn({
        redirectUrl: window.location.href,
      });
      return;
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // 絵文字を挿入する関数
  const handleEmojiSelect = (emoji: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      textarea.value = newText;
      // カーソル位置を絵文字の後に移動
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
      // フォームの値を更新（Reactの制御コンポーネントではないため、手動で更新）
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={handleClose}
      />
      {/* モーダルコンテンツ */}
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
          {/* 返信先の投稿を表示 */}
          <div className="mb-4 pb-4 border-b border-border">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={replyToAvatar} />
                <AvatarFallback>{replyToName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{replyToName}</span>
                  <span className="text-sm text-muted-foreground">{replyToUsername}</span>
                </div>
                <p className="text-sm text-foreground break-words">{replyToContent}</p>
              </div>
            </div>
          </div>

          {/* 返信フォーム */}
          <form ref={formRef} action={formAction} onSubmit={handleSubmit}>
            <input type="hidden" name="parentId" value={postId} />
            <div className="flex gap-3 items-start">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user?.imageUrl || undefined} />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  name="content"
                  className="w-full min-h-[120px] resize-none bg-transparent text-lg placeholder:text-muted-foreground focus:outline-none mb-3"
                  placeholder="返信をポスト"
                  required
                />
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
                    {isPending ? '返信中...' : '返信'}
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
