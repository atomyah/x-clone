# Seedデータの投入方法

このドキュメントでは、SupabaseのSQLエディタを使用してSeedデータを投入する方法を説明します。

## 📋 Seedデータの内容

`seed.sql`には以下のデータが含まれています：

### ユーザー（5人）
- **田中太郎** (tanaka_taro) - フルスタックエンジニア
- **鈴木花子** (suzuki_hanako) - デザイナー兼フロントエンドエンジニア
- **佐藤一郎** (sato_ichiro) - バックエンドエンジニア
- **山田優希** (yamada_yuki) - プロダクトマネージャー
- **渡辺美香** (watanabe_mika) - データサイエンティスト

### 投稿（11件）
- 各ユーザーの投稿（8件）
- リプライ（返信）（3件）

### フォロー関係（13件）
- ユーザー間の相互フォロー関係

### いいね（20件）
- 投稿やリプライへのいいね

## 🚀 Seedデータの投入手順

### 方法1: Supabase SQLエディタを使用（推奨）

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com/dashboard にアクセス
   - プロジェクトを選択

2. **SQLエディタを開く**
   - 左側のメニューから「SQL Editor」を選択
   - 「New Query」をクリック

3. **SQLファイルの内容をコピー**
   - `prisma/seed.sql`の内容をすべてコピー
   - SQLエディタに貼り付け

4. **実行**
   - 「Run」ボタン（または`Ctrl + Enter` / `Cmd + Enter`）をクリック
   - 実行が完了すると、挿入されたレコード数が表示されます

5. **結果の確認**
   - 最後に表示される確認クエリで、各テーブルのレコード数を確認できます
     - ユーザー数: 5
     - 投稿数: 11
     - フォロー関係数: 13
     - いいね数: 20

### 方法2: ターミナルからpsqlを使用

```bash
# 環境変数を読み込み
source .env.local

# psqlでSQLファイルを実行（DIRECT_URLを使用）
psql $DIRECT_URL -f prisma/seed.sql
```

## 🔄 データのリセット

既存のデータをクリアして再度Seedデータを投入したい場合：

1. `seed.sql`の上部にあるDELETE文のコメントを外してください：

```sql
-- コメントを外す
DELETE FROM likes;
DELETE FROM follows;
DELETE FROM posts;
DELETE FROM users;
```

2. 再度SQLを実行してください

⚠️ **注意**: この操作は既存のすべてのデータを削除します。本番環境では使用しないでください。

## 📊 データの確認

### Supabase Table Editorで確認

1. 左側のメニューから「Table Editor」を選択
2. 各テーブル（users, posts, follows, likes）を選択
3. データが正しく投入されているか確認

### SQLで確認

```sql
-- 各テーブルのレコード数を確認
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'posts', COUNT(*) FROM posts
UNION ALL
SELECT 'follows', COUNT(*) FROM follows
UNION ALL
SELECT 'likes', COUNT(*) FROM likes;

-- ユーザー一覧を確認
SELECT id, username, display_name, email FROM users ORDER BY created_at;

-- 投稿一覧を確認（ユーザー名と一緒に）
SELECT 
  p.id, 
  u.username, 
  LEFT(p.content, 50) as content_preview,
  p.created_at
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- フォロー関係を確認
SELECT 
  follower.username as follower,
  following.username as following
FROM follows f
JOIN users follower ON f.follower_id = follower.id
JOIN users following ON f.following_id = following.id
ORDER BY f.created_at;

-- いいねの状況を確認
SELECT 
  u.username,
  COUNT(*) as likes_given
FROM likes l
JOIN users u ON l.user_id = u.id
GROUP BY u.username
ORDER BY likes_given DESC;
```

## 🎯 次のステップ

Seedデータの投入が完了したら、アプリケーションを起動してデータが正しく表示されるか確認してください：

```bash
npm run dev
```

## 💡 カスタマイズ

Seedデータをカスタマイズする場合は、`seed.sql`を編集してください：

- ユーザーの追加: `INSERT INTO users`セクションに新しいレコードを追加
- 投稿の追加: `INSERT INTO posts`セクションに新しいレコードを追加
- UUIDの生成: 新しいUUIDが必要な場合は、オンラインジェネレーターを使用するか、PostgreSQLの`gen_random_uuid()`関数を使用できます

## 🐛 トラブルシューティング

### エラー: "duplicate key value violates unique constraint"

すでにデータが存在する場合、このエラーが発生します。データをリセットしてから再実行してください。

### エラー: "foreign key constraint violation"

リレーション関係が正しくない場合に発生します。削除する順序を確認してください（likes → follows → posts → users の順）。

### 接続エラー

- Supabaseプロジェクトが起動しているか確認
- `.env.local`の`DATABASE_URL`と`DIRECT_URL`が正しく設定されているか確認
- ネットワーク接続を確認

