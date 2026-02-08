//// 59. useActionStateで状態管理を統合
// フォーム送信機能を実装
// handleSubmit関数はログインしてるかどうか確認してるだけ（してなかったらopenSignIn()でClerk画面をひらく）
// ログインしてると、フォームのaction属性にformActionを設定してあるformActionが実行され,
// Server ActionであるcreateReply() が実行される.その後、revalidatePath()でページを再検証して最新の返信を表示する.

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ImageIcon,
  Smile,
} from 'lucide-react';
import { createReply, type CreateReplyState } from '@/lib/actions/posts';

const initialState: CreateReplyState | null = null;

interface ReplyFormProps {
  postId?: string;
  replyToUsername?: string;
}

export function ReplyForm({ postId, replyToUsername }: ReplyFormProps) {
  const [state, formAction, isPending] = useActionState<CreateReplyState | null, FormData>(
    createReply,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { isSignedIn } = useAuth(); // useAuth()のisSignedInでログイン状態を確認
  const { openSignIn } = useClerk(); // useClerk()のopenSignInでログイン画面を表示
  const { user } = useUser(); // useUser()のuserでユーザー情報を取得

  // 返信成功時にフォームをリセット
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  // 未ログインで送信するとServer Actionでエラーになるので、事前にログインを促してる
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      openSignIn({      // Clerkのログイン画面を表示
        redirectUrl: window.location.href,
      });
      return;
    }
  };

  if (!postId) {
    return null;
  }

  return (
    <div className="px-4 py-3">
      {replyToUsername && (
        <div className="mb-2 text-sm text-muted-foreground pl-14">
          返信先: <span className="text-primary">@{replyToUsername}</span>さん
        </div>
      )}
      {/* フォームのaction属性にformActionを設定.handleSubmit関数はログイン状態を確認してるだけ（してなかったらopenSignIn()でClerk画面をひらく） */}
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
            <input
              type="text"
              name="content"
              className="w-full bg-transparent text-2xl placeholder:text-muted-foreground focus:outline-none mb-3 py-5 min-h-[60px]"
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-primary hover:bg-primary/10 shrink-0"
                  title="メディア"
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-primary hover:bg-primary/10 shrink-0"
                  title="GIF画像"
                >
                  <div className="w-5 h-5 flex items-center justify-center text-xs font-bold">GIF</div>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-primary hover:bg-primary/10 shrink-0"
                  title="絵文字"
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </div>
              <Button
                type="submit"
                variant="outline"
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
  );
}
