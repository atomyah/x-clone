import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// サーバーサイド用のSupabaseクライアント（匿名キー）
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

// サーバーサイド用のSupabaseクライアント（サービスロールキー - Storage書き込み用）
// 注意: このキーは機密情報です。クライアントサイドで使用しないでください
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// クライアントサイド用のSupabaseクライアント（ブラウザ専用）
export function createSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

