-- SNSクローン用Seedデータ
-- SupabaseのSQLエディタで実行してください

-- 既存のデータをクリア（必要に応じてコメントアウト）
DELETE FROM likes;
DELETE FROM follows;
DELETE FROM posts;
DELETE FROM users;

-- ユーザーデータ
INSERT INTO users (id, "clerkId", email, username, display_name, bio, profile_image_url, cover_image_url, created_at, updated_at)
VALUES 
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'clerk_user_001',
    'tanaka@example.com',
    'tanaka_taro',
    '田中太郎',
    'フルスタックエンジニア。React、TypeScript、Next.jsが好きです。',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka',
    NULL,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
  ),
  (
    'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    'clerk_user_002',
    'suzuki@example.com',
    'suzuki_hanako',
    '鈴木花子',
    'デザイナー兼フロントエンドエンジニア。UI/UXに興味があります。',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=suzuki',
    NULL,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    'c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    'clerk_user_003',
    'sato@example.com',
    'sato_ichiro',
    '佐藤一郎',
    'バックエンドエンジニア。Node.js、PostgreSQL、GraphQLが得意です。',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=sato',
    NULL,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    'd3bbcd99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
    'clerk_user_004',
    'yamada@example.com',
    'yamada_yuki',
    '山田優希',
    'プロダクトマネージャー。アジャイル開発とスクラムが好きです。',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=yamada',
    NULL,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  (
    'e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid,
    'clerk_user_005',
    'watanabe@example.com',
    'watanabe_mika',
    '渡辺美香',
    'データサイエンティスト。機械学習とAIに興味があります。',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=watanabe',
    NULL,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  );

-- 投稿データ
INSERT INTO posts (id, content, user_id, parent_id, created_at, updated_at)
VALUES 
  -- 田中太郎の投稿
  (
    'a1111111-1111-4111-a111-111111111111'::uuid,
    'Next.js 16がリリースされました！新機能が盛りだくさんで楽しみです。特にキャッシュコンポーネントとPartial Prerenderingが気になります。',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    NULL,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),
  (
    'a2222222-2222-4222-a222-222222222222'::uuid,
    'Prisma 7がリリースされましたね。型安全性がさらに向上して、開発体験が良くなりました。',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  
  -- 鈴木花子の投稿
  (
    'b3333333-3333-4333-a333-333333333333'::uuid,
    'Figmaで新しいデザインシステムを作成中です。コンポーネントの再利用性を高めて、開発効率を上げたいですね。',
    'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    NULL,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  ),
  (
    'b4444444-4444-4444-a444-444444444444'::uuid,
    'Tailwind CSSの新しいv4が素晴らしいです！パフォーマンスが大幅に改善されました。',
    'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    NULL,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),

  -- 佐藤一郎の投稿
  (
    'c5555555-5555-4555-a555-555555555555'::uuid,
    'SupabaseのEdge Functionsを使って、リアルタイムAPIを構築しています。Denoベースで書きやすいですね。',
    'c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    NULL,
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '6 days'
  ),
  (
    'c6666666-6666-4666-a666-666666666666'::uuid,
    'PostgreSQLのJSONB型を活用すると、柔軟なスキーマ設計ができて便利です。',
    'c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    NULL,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),

  -- 山田優希の投稿
  (
    'd7777777-7777-4777-a777-777777777777'::uuid,
    'スプリントプランニングでチームの目標を明確にすることが重要です。みんなで協力して良いプロダクトを作りましょう！',
    'd3bbcd99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
    NULL,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
  ),

  -- 渡辺美香の投稿
  (
    'e8888888-8888-4888-a888-888888888888'::uuid,
    'Claude 3.5 Sonnetを使ったAIアプリケーション開発が面白いです。自然言語処理の精度がすごい！',
    'e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid,
    NULL,
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days'
  ),

  -- リプライ（返信）
  (
    'f1111111-1111-4111-a111-111111111111'::uuid,
    '私もNext.js 16試してみました！Partial Prerenderingは本当に画期的ですね。',
    'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    'a1111111-1111-4111-a111-111111111111'::uuid,
    NOW() - INTERVAL '4 days' - INTERVAL '2 hours',
    NOW() - INTERVAL '4 days' - INTERVAL '2 hours'
  ),
  (
    'f2222222-2222-4222-a222-222222222222'::uuid,
    '型安全性は本当に大事ですよね。バグを事前に防げるので開発が楽になります。',
    'c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    'a2222222-2222-4222-a222-222222222222'::uuid,
    NOW() - INTERVAL '2 days' - INTERVAL '3 hours',
    NOW() - INTERVAL '2 days' - INTERVAL '3 hours'
  ),
  (
    'f3333333-3333-4333-a333-333333333333'::uuid,
    'デザインシステム、ぜひ見せてください！参考にしたいです。',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'b3333333-3333-4333-a333-333333333333'::uuid,
    NOW() - INTERVAL '3 days' - INTERVAL '5 hours',
    NOW() - INTERVAL '3 days' - INTERVAL '5 hours'
  );

-- フォロー関係
INSERT INTO follows (follower_id, following_id, created_at)
VALUES 
  -- 田中太郎のフォロー
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, NOW() - INTERVAL '20 days'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, NOW() - INTERVAL '18 days'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd3bbcd99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, NOW() - INTERVAL '15 days'),
  
  -- 鈴木花子のフォロー
  ('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, NOW() - INTERVAL '19 days'),
  ('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid, NOW() - INTERVAL '10 days'),
  
  -- 佐藤一郎のフォロー
  ('c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, NOW() - INTERVAL '17 days'),
  ('c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, NOW() - INTERVAL '16 days'),
  ('c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid, NOW() - INTERVAL '12 days'),
  
  -- 山田優希のフォロー
  ('d3bbcd99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, NOW() - INTERVAL '14 days'),
  ('d3bbcd99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, 'c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, NOW() - INTERVAL '13 days'),
  
  -- 渡辺美香のフォロー
  ('e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, NOW() - INTERVAL '9 days'),
  ('e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid, 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, NOW() - INTERVAL '8 days'),
  ('e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid, 'c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, NOW() - INTERVAL '7 days');

-- いいね
INSERT INTO likes (user_id, post_id, created_at)
VALUES 
  -- 田中太郎の投稿へのいいね
  ('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'a1111111-1111-4111-a111-111111111111'::uuid, NOW() - INTERVAL '4 days'),
  ('c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'a1111111-1111-4111-a111-111111111111'::uuid, NOW() - INTERVAL '4 days'),
  ('d3bbcd99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, 'a1111111-1111-4111-a111-111111111111'::uuid, NOW() - INTERVAL '4 days'),
  ('e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid, 'a2222222-2222-4222-a222-222222222222'::uuid, NOW() - INTERVAL '2 days'),
  
  -- 鈴木花子の投稿へのいいね
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b3333333-3333-4333-a333-333333333333'::uuid, NOW() - INTERVAL '3 days'),
  ('c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'b3333333-3333-4333-a333-333333333333'::uuid, NOW() - INTERVAL '3 days'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'b4444444-4444-4444-a444-444444444444'::uuid, NOW() - INTERVAL '1 day'),
  ('e4ccde99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid, 'b4444444-4444-4444-a444-444444444444'::uuid, NOW() - INTERVAL '1 day'),
  
  -- 佐藤一郎の投稿へのいいね
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'c5555555-5555-4555-a555-555555555555'::uuid, NOW() - INTERVAL '5 days'),
  ('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'c5555555-5555-4555-a555-555555555555'::uuid, NOW() - INTERVAL '5 days'),
  ('d3bbcd99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, 'c6666666-6666-4666-a666-666666666666'::uuid, NOW() - INTERVAL '12 hours'),
  
  -- 山田優希の投稿へのいいね
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'd7777777-7777-4777-a777-777777777777'::uuid, NOW() - INTERVAL '6 days'),
  ('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'd7777777-7777-4777-a777-777777777777'::uuid, NOW() - INTERVAL '6 days'),
  
  -- 渡辺美香の投稿へのいいね
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'e8888888-8888-4888-a888-888888888888'::uuid, NOW() - INTERVAL '7 days'),
  ('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'e8888888-8888-4888-a888-888888888888'::uuid, NOW() - INTERVAL '7 days'),
  ('c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'e8888888-8888-4888-a888-888888888888'::uuid, NOW() - INTERVAL '7 days'),
  
  -- リプライへのいいね
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'f1111111-1111-4111-a111-111111111111'::uuid, NOW() - INTERVAL '4 days'),
  ('c2aabc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'f1111111-1111-4111-a111-111111111111'::uuid, NOW() - INTERVAL '4 days'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'f2222222-2222-4222-a222-222222222222'::uuid, NOW() - INTERVAL '2 days');

-- 挿入結果の確認
SELECT 'ユーザー数: ' || COUNT(*) FROM users;
SELECT '投稿数: ' || COUNT(*) FROM posts;
SELECT 'フォロー関係数: ' || COUNT(*) FROM follows;
SELECT 'いいね数: ' || COUNT(*) FROM likes;

