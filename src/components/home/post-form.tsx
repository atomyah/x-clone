// useActionStateでリファクタリング

'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmojiPicker } from '@/components/ui/emoji-picker';
// Server Action↓
import { createPost, type CreatePostState } from '@/lib/actions/posts';

const initialState: CreatePostState | null = null;

export function PostForm() {
  const [state, formAction, isPending] = useActionState<CreatePostState | null, FormData>(
    // useActionStateで状態管理を統合. isPendingでローディング状態を管理. エラーハンドリングはstateから取得
    createPost, // Server Action(lib/actions/post.tsのcreatePost)はprevStateとformDataを受け取る
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  // 投稿成功時にフォームをリセット
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      openSignIn({
        redirectUrl: window.location.href,
      });
      return;
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

  return (
    <div className="p-4">       
      <form ref={formRef} action={formAction} onSubmit={handleSubmit}>  {/* フォームのaction属性にformActionを設定 */}
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.imageUrl || undefined} />
            <AvatarFallback>
              {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              name="content"
              className="w-full min-h-[60px] resize-none bg-transparent text-xl placeholder:text-muted-foreground focus:outline-none"
              placeholder="いまどうしてる？"
              required
            />
            {state?.error && (
              <div className="mt-2 text-sm text-destructive">
                {state.error}
              </div>
            )}
            <div className="flex items-center justify-between pt-3 mt-3">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
              <Button
                type="submit"
                className="rounded-full font-bold px-4 md:px-6 text-sm md:text-base ml-auto shrink-0"
                disabled={isPending}
              >
                {isPending ? '投稿中...' : 'ポストする'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

