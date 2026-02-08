/**
 * ========================================
 * Supabase Storage 画像アップロードユーティリティ
 * ========================================
 * 
 * 【役割】
 * - Supabase Storageへの画像アップロード処理
 * - 画像の削除処理
 * - 画像URLの生成
 * 
 * 【使用箇所】
 * - lib/actions/users.ts（プロフィール画像・カバー画像のアップロード）
 */

import { supabaseAdmin, supabaseServer } from './supabase';

const COVER_IMAGE_BUCKET = 'cover-images';
const PROFILE_IMAGE_BUCKET = 'profile-images';

/**
 * 画像をSupabase Storageにアップロード
 * @param file アップロードするファイル
 * @param bucket バケット名
 * @param fileName ファイル名（一意である必要がある）
 * @returns アップロードされた画像の公開URL
 */
export async function uploadImageToStorage(
  file: File,
  bucket: string,
  fileName: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    // ファイルサイズチェック（5MB制限）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        url: null,
        error: '画像サイズは5MB以下にしてください。',
      };
    }

    // ファイルタイプチェック（画像のみ）
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        url: null,
        error: 'JPEG、PNG、WebP形式の画像のみアップロードできます。',
      };
    }

    // サービスロールキーが設定されているか確認
    if (!supabaseAdmin) {
      console.error('Supabaseサービスロールキーが設定されていません。');
      return {
        url: null,
        error: 'サーバー設定エラー: 環境変数SUPABASE_SERVICE_ROLE_KEYが設定されていません。',
      };
    }

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Supabase Storageにアップロード（サービスロールキーを使用）
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true, // 既存のファイルを上書き
      });

    if (error) {
      console.error('Supabase Storageアップロードエラー:', error);
      
      // エラーの種類に応じたメッセージを返す
      let errorMessage = '画像のアップロードに失敗しました。';
      
      if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
        errorMessage = `バケット「${bucket}」が存在しません。SupabaseダッシュボードのStorageセクションでバケットを作成してください。`;
      } else if (error.message?.includes('new row violates row-level security') || error.message?.includes('RLS')) {
        errorMessage = '権限エラー: StorageのRLSポリシーを確認してください。バケットを公開設定にするか、適切なRLSポリシーを設定してください。';
      } else if (error.message?.includes('JWT') || error.message?.includes('Invalid API key')) {
        errorMessage = '認証エラー: SupabaseのAPIキーを確認してください。service_roleキーが必要な場合は、環境変数SUPABASE_SERVICE_ROLE_KEYを設定してください。';
      } else {
        errorMessage = `画像のアップロードに失敗しました: ${error.message || JSON.stringify(error)}`;
      }
      
      return {
        url: null,
        error: errorMessage,
      };
    }

    // 公開URLを取得（匿名キーで取得可能）
    const { data: urlData } = supabaseServer.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      error: null,
    };
  } catch (error: any) {
    console.error('画像アップロードエラー:', error);
    return {
      url: null,
      error: `画像のアップロードに失敗しました: ${error?.message || '不明なエラー'}`,
    };
  }
}

/**
 * カバー画像をアップロード
 * @param file アップロードするファイル
 * @param userId ユーザーID（ファイル名に使用）
 * @returns アップロードされた画像の公開URL
 */
export async function uploadCoverImage(
  file: File,
  userId: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  const fileName = `${userId}/${Date.now()}-cover.jpg`;
  return uploadImageToStorage(file, COVER_IMAGE_BUCKET, fileName);
}

/**
 * プロフィール画像をアップロード
 * @param file アップロードするファイル
 * @param userId ユーザーID（ファイル名に使用）
 * @returns アップロードされた画像の公開URL
 */
export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  const fileName = `${userId}/${Date.now()}-profile.jpg`;
  return uploadImageToStorage(file, PROFILE_IMAGE_BUCKET, fileName);
}

/**
 * Supabase Storageから画像を削除
 * @param url 削除する画像のURL
 * @param bucket バケット名
 */
export async function deleteImageFromStorage(
  url: string,
  bucket: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // サービスロールキーが設定されているか確認
    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'サーバー設定エラー: 環境変数SUPABASE_SERVICE_ROLE_KEYが設定されていません。',
      };
    }

    // URLからパスを抽出
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const folder = pathParts[pathParts.length - 2];
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Supabase Storage削除エラー:', error);
      return {
        success: false,
        error: '画像の削除に失敗しました。',
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('画像削除エラー:', error);
    return {
      success: false,
      error: '画像の削除に失敗しました。',
    };
  }
}
