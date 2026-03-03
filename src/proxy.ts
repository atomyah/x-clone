// 未ログインでも全ページ閲覧でき、投稿/返信/リポスト/いいねは既存のServer Action側の認証チェックで制御される。

import { clerkMiddleware } from '@clerk/nextjs/server'

// 閲覧は全ページ公開。認証必須の操作はServer Actions側で判定する。
export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
