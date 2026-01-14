import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { prisma } from '@/lib/prisma';

/**
 * ClerkのWebhookを処理するエンドポイント
 * user.created, user.updated, user.deletedイベントでSupabaseのユーザーテーブルを同期
 */
export async function POST(req: NextRequest) {
  try {
    // Webhookの署名を検証
    const evt = await verifyWebhook(req);

    // イベントタイプを取得
    const eventType = evt.type;

    // user.createdイベントを処理
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;

      try {
        // メールアドレスを取得
        const email = email_addresses?.[0]?.email_address;
        if (!email) {
          console.error('メールアドレスが取得できませんでした');
          return NextResponse.json(
            { error: 'Email address not found' },
            { status: 400 }
          );
        }

        // usernameを生成（Clerkのusernameまたはemailから）
        let generatedUsername = username;
        if (!generatedUsername) {
          // emailの@より前の部分を使用
          generatedUsername = email.split('@')[0];
          // 既に存在する場合は、数字を追加
          let counter = 1;
          let finalUsername = generatedUsername;
          while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
            finalUsername = `${generatedUsername}${counter}`;
            counter++;
          }
          generatedUsername = finalUsername;
        }

        // displayNameを生成
        const displayName = first_name && last_name
          ? `${first_name} ${last_name}`
          : first_name || last_name || email.split('@')[0];

        // データベースにユーザーを作成
        const user = await prisma.user.create({
          data: {
            clerkId: id,
            email: email,
            username: generatedUsername,
            displayName: displayName,
            profileImageUrl: image_url || null,
          },
        });

        console.log('ユーザーを作成しました:', user.id);

        return NextResponse.json(
          { message: 'User created successfully', userId: user.id },
          { status: 200 }
        );
      } catch (error: any) {
        console.error('ユーザー作成エラー:', error);

        // 既に存在するユーザーの場合は成功として扱う
        if (error.code === 'P2002') {
          console.log('ユーザーは既に存在します:', id);
          return NextResponse.json(
            { message: 'User already exists' },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { error: 'Failed to create user', details: error.message },
          { status: 500 }
        );
      }
    }

    // user.updatedイベントを処理
    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;

      try {
        const email = email_addresses?.[0]?.email_address;
        if (!email) {
          return NextResponse.json(
            { error: 'Email address not found' },
            { status: 400 }
          );
        }

        // displayNameを生成
        const displayName = first_name && last_name
          ? `${first_name} ${last_name}`
          : first_name || last_name || email.split('@')[0];

        // データベースのユーザーを更新
        await prisma.user.update({
          where: { clerkId: id },
          data: {
            email: email,
            username: username || undefined,
            displayName: displayName,
            profileImageUrl: image_url || undefined,
          },
        });

        console.log('ユーザーを更新しました:', id);

        return NextResponse.json(
          { message: 'User updated successfully' },
          { status: 200 }
        );
      } catch (error: any) {
        console.error('ユーザー更新エラー:', error);

        // ユーザーが存在しない場合は404を返す
        if (error.code === 'P2025') {
          console.log('ユーザーが見つかりません:', id);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(
          { error: 'Failed to update user', details: error.message },
          { status: 500 }
        );
      }
    }

    // user.deletedイベントを処理
    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      try {
        // データベースからユーザーを削除
        // CASCADE DELETEにより、関連する投稿、いいね、フォローも自動的に削除される
        await prisma.user.delete({
          where: { clerkId: id },
        });

        console.log('ユーザーを削除しました:', id);

        return NextResponse.json(
          { message: 'User deleted successfully' },
          { status: 200 }
        );
      } catch (error: any) {
        console.error('ユーザー削除エラー:', error);

        // ユーザーが存在しない場合は成功として扱う（既に削除済み）
        if (error.code === 'P2025') {
          console.log('ユーザーは既に削除されています:', id);
          return NextResponse.json(
            { message: 'User already deleted' },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { error: 'Failed to delete user', details: error.message },
          { status: 500 }
        );
      }
    }

    // その他のイベントタイプは無視
    console.log('未処理のイベントタイプ:', eventType);
    return NextResponse.json(
      { message: 'Event type not handled', eventType },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Webhook署名の検証に失敗しました:', err);
    return NextResponse.json(
      { error: 'Invalid signature', details: err?.message },
      { status: 400 }
    );
  }
}
