# 要件定義書

# SNSアプリケーション 要件定義書（MVP）

## プロジェクト概要

XのようなSNSアプリケーションをWeb上で開発する。
まずはMVP（実用最小限の製品）として、SNSの基本機能を実装する。

## Phase 1: 実装機能

### 1. ユーザー認証

- ユーザー登録（メールアドレス + パスワード、Clerk認証）
- ログイン・ログアウト

### 2. プロフィール機能

- プロフィール表示
- プロフィール編集（表示名、ユーザー名、自己紹介）
- プロフィール画像のアップロード

### 3. 投稿機能

- テキスト投稿（280文字制限）、画像投稿（ポストMVPで追加予定）
- 投稿の削除
- 投稿一覧の表示

### 4. タイムライン

- 全体タイムライン（全ユーザーの投稿）
- フォロー中タイムライン（フォロー中のユーザーの投稿）
- 個人タイムライン（特定ユーザーの投稿）

### 5. フォロー機能

- ユーザーのフォロー・アンフォロー
- フォロー数・フォロワー数の表示

### 6. 返信機能

- 投稿への返信
- スレッド表示（投稿と返信の紐付け）

### 7. いいね機能

- 投稿へのいいね・いいね解除
- いいね数の表示

---

## 技術スタック

### フロントエンド

- Next.js 14-15 (App Router)
- TypeScript
- App Router
- ページルーティングの簡素化
- SEO対策の容易さ

### UIライブラリ／スタイリング

- Tailwind CSS
- shadcn/ui

### バックエンド

- Next.js API Routes

### データベース

- Supabase
- Prisma

### 認証

- Clerk

### ファイルストレージ

- Cloudinary または Vercel Blob

### 開発環境／ツール

- npm
- ESLint
- Prettier

### テスト

- **Vitest**
- **Playwright** - E2Eテスト

### ホスティング

- Vercel

---

## データベース設計

### 1. Users（ユーザー）

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | String (CUID) | 主キー |
| clerkId | String (unique) |  |
| email | String (unique) | メールアドレス |
| username | String (unique) | @ユーザー名 |
| display_name | String | 表示名 |
| password | String | ハッシュ化パスワード |
| bio | String? | 自己紹介文 |
| profile_image | String? | プロフィール画像URL |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 2. Posts（投稿）

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | String (CUID) | 主キー |
| content | String (280) | 投稿内容 |
| user_id | String | 投稿者ID（外部キー） |
| parent_id | String? | 親投稿ID（返信時） |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 3. Follows（フォロー）

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| follower_id | String(UUID) | フォローする人ID（外部キー） |
| following_id | String(UUID) | フォローされる人ID（外部キー） |
| created_at | TIMESTAMP | 作成日時 |

**制約**: (followerId, followingId) の組み合わせは一意（PRIMARY KEY (follower_id, following_id)）

### 4. Likes（いいね）

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| user_id | String (UUID) | いいねした人ID（外部キー） |
| post_id | String(UUID) | いいねされた投稿ID（外部キー） |
| created_at | TIMESTAMP | 作成日時 |

**制約**: (userId, postId) の組み合わせは一意PRIMARY KEY (user_id, post_id)

## **ER図**

![image.png](image.png)

---

## システムアーキテクチャ図

![Decision Path Option-2025-12-23-061319.png](Decision_Path_Option-2025-12-23-061319.png)

---

## ディレクトリ構成

project-root/
├── .env.local                    # 環境変数（DB接続情報、API KEY等）
├── .eslintrc.json                # ESLint設定（コード品質チェック）
├── .gitignore                    # Gitで管理しないファイルのリスト
├── .prettierrc                   # Prettier設定（コード整形）
├── next.config.js                # Next.js設定ファイル
├── package.json                  # npmパッケージ管理・スクリプト定義
├── postcss.config.js             # PostCSS設定（Tailwind用）
├── tailwind.config.js            # Tailwind CSS設定
├── tsconfig.json                 # TypeScript設定
├── [README.md](http://readme.md/)                     # プロジェクト説明ドキュメント
│
├── app/                          # Next.js App Router（ルーティング・ページ）
│   ├── layout.tsx                # ルートレイアウト（全ページ共通）
│   ├── page.tsx                  # トップページ（/）
│   ├── globals.css               # グローバルスタイル
│   │
│   ├── auth/                     # 認証関連ページ
│   │   ├── sign-in/              # ログインページ
│   │   │   └── page.tsx          # /auth/sign-in
│   │   └── sign-up/              # 新規登録ページ
│   │       └── page.tsx          # /auth/sign-up
│   │
│   ├── dashboard/                # ダッシュボード
│   │   ├── page.tsx              # /dashboard メインダッシュボード
│   │   └── timeline/             # タイムライン
│   │       └── page.tsx          # /dashboard/timeline
│   │
│   ├── profile/                  # ユーザープロフィール
│   │   └── [id]/                 # 動的ルート（ユーザーID）
│   │       ├── page.tsx          # /profile/[id] プロフィール表示
│   │       └── edit/             # プロフィール編集
│   │           └── page.tsx      # /profile/[id]/edit
│   │
│   ├── post/                     # 投稿詳細
│   │   └── [id]/                 # 動的ルート（投稿ID）
│   │       └── page.tsx          # /post/[id] 投稿詳細・返信表示
│   │
│   └── api/                      # API Routes（バックエンドAPI）
│       ├── posts/                # 投稿関連API
│       │   ├── route.ts          # GET(一覧取得), POST(投稿作成)
│       │   └── [id]/             # 個別投稿操作
│       │       └── route.ts      # GET(詳細), DELETE(削除)
│       ├── users/                # ユーザー関連API
│       │   ├── route.ts          # GET(ユーザー一覧・検索)
│       │   └── [id]/             # 個別ユーザー操作
│       │       └── route.ts      # GET(詳細), PUT(更新)
│       ├── likes/                # いいね関連API
│       │   └── route.ts          # POST(いいね), DELETE(いいね解除)
│       └── follows/              # フォロー関連API
│           └── route.ts          # POST(フォロー), DELETE(アンフォロー)
│
├── components/                   # 再利用可能なReactコンポーネント
│   ├── ui/                       # shadcn/ui 汎用UIコンポーネント
│   │   ├── button.tsx            # ボタンコンポーネント
│   │   ├── card.tsx              # カードコンポーネント
│   │   ├── input.tsx             # 入力フィールド
│   │   ├── textarea.tsx          # テキストエリア
│   │   ├── avatar.tsx            # アバター表示
│   │   ├── dialog.tsx            # モーダルダイアログ
│   │   ├── dropdown-menu.tsx     # ドロップダウンメニュー
│   │   └── ...                   # その他UIコンポーネント
│   │
│   └── features/                 # 機能別コンポーネント
│       ├── post/                 # 投稿関連コンポーネント
│       │   ├── post-card.tsx     # 投稿カード表示
│       │   ├── post-form.tsx     # 投稿フォーム
│       │   ├── post-actions.tsx  # いいね・返信・削除ボタン
│       │   └── post-list.tsx     # 投稿リスト表示
│       │
│       ├── user/                 # ユーザー関連コンポーネント
│       │   ├── user-profile.tsx  # ユーザープロフィール表示
│       │   ├── user-card.tsx     # ユーザーカード
│       │   ├── user-avatar.tsx   # ユーザーアバター
│       │   └── follow-button.tsx # フォローボタン
│       │
│       └── timeline/             # タイムライン関連コンポーネント
│           ├── timeline-feed.tsx # タイムラインフィード
│           ├── timeline-filter.tsx # フィルター（全体・フォロー中）
│           └── timeline-item.tsx # タイムライン項目
│
├── lib/                          # ユーティリティ・ヘルパー関数
│   ├── prisma.ts                 # Prismaクライアントインスタンス
│   ├── clerk.ts                  # Clerk認証設定・ヘルパー
│   ├── utils.ts                  # 汎用ユーティリティ関数
│   ├── validations.ts            # バリデーションスキーマ（Zod等）
│   └── constants.ts              # 定数定義（文字数制限等）
│
├── prisma/                       # Prismaデータベース設定
│   ├── schema.prisma             # データベーススキーマ定義
│   └── migrations/               # マイグレーション履歴
│       ├── migration_lock.toml   # マイグレーションロックファイル
│       └── YYYYMMDDHHMMSS_migration_name/  # 各マイグレーション
│           └── migration.sql     # SQLマイグレーションファイル
│
├── public/                       # 静的ファイル（公開アセット）
│   ├── images/                   # 画像ファイル
│   ├── icons/                    # アイコン・ファビコン
│   └── fonts/                    # カスタムフォント
│
├── tests/                        # テストファイル
│   ├── unit/                     # ユニットテスト
│   │   ├── lib/                  # ユーティリティ関数のテスト
│   │   │   └── utils.test.ts     # utils.tsのテスト
│   │   └── components/           # コンポーネントのテスト
│   │       └── post-card.test.tsx # PostCardコンポーネントのテスト
│   │
│   └── e2e/                      # E2Eテスト（Playwright）
│       ├── auth.spec.ts          # 認証フローのテスト
│       ├── post.spec.ts          # 投稿機能のテスト
│       ├── profile.spec.ts       # プロフィール機能のテスト
│       └── follow.spec.ts        # フォロー機能のテスト
│
└── types/                        # TypeScript型定義
├── index.ts                  # 型定義のエクスポート
├── post.ts                   # 投稿関連の型定義
├── user.ts                   # ユーザー関連の型定義
└── api.ts                    # APIレスポンスの型定義

---

## 開発方針

- **MVP優先**: 完璧を目指さず、動くものを早く作る
- **段階的な拡張**: Phase 1完成後、必要に応じて機能を追加
- **DB設計の柔軟性**: 後からの変更を許容する（Prismaマイグレーション活用）
- **シンプル設計**: 複雑な機能は後回し、基本機能に集中

---

## 次のステップ

1. プロジェクトセットアップ
2. データベース接続設定
3. 認証機能の実装
4. 投稿・タイムライン機能の実装
5. フォロー・いいね機能の実装
6. 返信機能の実装

---

**作成日**: 2025年12月23日

**バージョン**: 1.0（MVP）