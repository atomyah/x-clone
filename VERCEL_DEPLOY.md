# Vercel デプロイ時のデータベース接続設定

## 問題
Vercel から Supabase の直接接続（`db.xxx.supabase.co:5432`）に接続できない場合があります。

## 解決策：Connection Pooler を使用する

Vercel の環境変数で **DATABASE_URL** を **Supabase Connection Pooler**（ポート 6543）に変更してください。

### 手順

1. **Supabase ダッシュボード**を開く
   - https://supabase.com/dashboard
   - プロジェクトを選択

2. **Connection Pooler の URL を取得**
   - 左メニュー「Project Settings」→「Database」
   - 「Connection string」セクションで「Connection pooling」を選択
   - **Transaction** モードの接続文字列をコピー（ポート **6543**）
   - 末尾に `?pgbouncer=true` を追加

3. **Vercel の環境変数を設定**
   - Vercel ダッシュボード → プロジェクト → Settings → Environment Variables
   - `DATABASE_URL` を以下の形式で設定（または上書き）:

   ```
   postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   - `[PROJECT-REF]`: プロジェクトID（例: bejosbewartlvecrihuq）
   - `[PASSWORD]`: データベースパスワード
   - `[REGION]`: リージョン（例: ap-northeast-1, us-east-1）

4. **再デプロイ**
   - 環境変数変更後、Redeploy を実行

### 接続文字列の例

```
# DATABASE_URL（Vercel 用・Transaction モード）
postgres://postgres.bejosbewartlvecrihuq:YOUR_PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# DIRECT_URL（ローカルマイグレーション用・そのまま）
postgres://postgres:[PASSWORD]@db.bejosbewartlvecrihuq.supabase.co:5432/postgres
```

### 補足
- **DATABASE_URL**: アプリ実行時・ビルド時に使用（Pooler 必須）
- **DIRECT_URL**: マイグレーション時に使用（ローカルで `prisma migrate deploy` 実行時）
