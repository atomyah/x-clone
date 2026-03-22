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
   - 上メニュー「connect」ボタンをクリック
   - 「Connect to your project」セクションで「ORM」→「Prisma」を選択
   - Configure ORM欄の Connect to Supabase via...のDATABASE_URL接続文字列をコピー（ポート **6543**）
   - 末尾に `?pgbouncer=true` を追加
   !!!!!!!!!!!!!!!!!! 以上、開発環境で使っていたものと違い無し !!!!!!!!!!!!!!!!!!!!!

3. **Vercel の環境変数を設定**
   !!!!!!!! 以上、開発環境で使っていたものと違い無いので以下の作業必要なし!!!!!!!!!!
   - Vercel ダッシュボード → プロジェクト → Settings → Environment Variables
   - `DATABASE_URL` を以下の形式で設定（または上書き）:

   ```
   postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   - `[PROJECT-REF]`: プロジェクトID（例: bejosbewartlvecrihuq）
   - `[PASSWORD]`: データベースパスワード
   - `[REGION]`: リージョン（例: ap-northeast-1, us-east-1）

4. **Vercel の環境変数“DIRECT_URL”を削除**
   DIRECT_URLがVercel環境変数にあるとデプロイ失敗する。使わない環境変数なので削除する。

5. **再デプロイ**
   - 環境変数変更後、Redeploy を実行

### 接続文字列の例

```
# DATABASE_URL（Vercel 用・Transaction モードー開発環境と変化なし）
postgres://postgres.bejosbewartlvecrihuq:YOUR_PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# DIRECT_URL（ローカルマイグレーション用・そのまま、というか削除）
postgres://postgres:[PASSWORD]@db.bejosbewartlvecrihuq.supabase.co:5432/postgres
```

### 補足
- **DATABASE_URL**: アプリ実行時・ビルド時に使用（Pooler 必須）
- **DIRECT_URL**: マイグレーション時に使用（ローカルで `prisma migrate deploy` 実行時）

---

## 問い合わせフォーム（reCAPTCHA）が本番で「ボット検証に失敗」になる場合

reCAPTCHA v3 は **キーに登録したドメイン** からしか有効なトークンになりません。

1. [Google reCAPTCHA 管理コンソール](https://www.google.com/recaptcha/admin) で該当キーを開く
2. **ドメイン** に本番 URL を追加（例: `x-clone.tech`）
3. カスタムドメインを使う場合はそのドメインも追加
4. Vercel の環境変数に `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` と `RECAPTCHA_SECRET_KEY` が **Production** に設定されているか確認

スコアが厳しすぎる場合は Vercel に `RECAPTCHA_MIN_SCORE=0.3` を追加できる（既定は `0.5`）。

失敗時は Vercel の **Functions ログ** に `[reCAPTCHA]` で始まる行が出ます（`error-codes` やスコアの切り分け用）。

---

## Clerk Webhook が本番（例: x-clone.tech）で Supabase に同期しない場合

`verifyWebhook` は環境変数 **`CLERK_WEBHOOK_SIGNING_SECRET`** を使います（Clerk の各 Endpoint ごとに **別のシークレット** が発行されます）。

### チェックリスト

1. **Clerk ダッシュボード右上の環境が Production**
   - 本番サイトは `pk_live_` / `sk_live_` を使う想定。ここで **Production** の Webhooks を開く。

2. **Endpoint の URL が実際に届く URL と一致**
   - カスタムドメイン運用なら例: `https://x-clone.tech/api/webhooks/clerk`
   - まだ `*.vercel.app` のままなら、Clerk 側もその URL に合わせるか、**本番用に Endpoint を追加**する。

3. **Vercel の `CLERK_WEBHOOK_SIGNING_SECRET` は「その Endpoint のシークレット」**
   - ngrok 用 Endpoint と本番 URL 用 Endpoint では **シークレットが違う**。
   - Clerk → Webhooks → **x-clone.tech 向け Endpoint** を開き、「Signing Secret」をコピーし、Vercel の **Production** 環境変数に貼り付ける（開発用の `whsec_...` のままにしない）。

4. **Vercel に Production 用の Clerk キー**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`（`pk_live_...`）
   - `CLERK_SECRET_KEY`（`sk_live_...`）

5. **Clerk で購読しているイベント**
   - 少なくとも `user.created` / `user.updated` / `user.deleted`（アプリの `route.ts` に合わせる）。

### 動作確認

- Clerk → Webhooks → **Logs** で、送信が **2xx** か **4xx** か確認。
- **4xx** かつ署名エラー → ほぼ `CLERK_WEBHOOK_SIGNING_SECRET` の取り違え。
- **5xx** → Vercel の **Functions / Runtime Logs** で `ユーザー作成エラー` や Prisma のログを確認（DB 接続・制約違反など）。
