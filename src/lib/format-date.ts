/**
 * 日時を相対的な表示に変換
 * 例: "5分前", "3時間前", "2日前"
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // 1分未満
  if (diffInSeconds < 60) {
    return '今';
  }

  // 1時間未満
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分前`;
  }

  // 24時間未満
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}時間前`;
  }

  // 7日未満
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}日前`;
  }

  // それ以上は日付表示
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const currentYear = now.getFullYear();

  // 同じ年なら年を省略
  if (year === currentYear) {
    return `${month}月${day}日`;
  }

  return `${year}年${month}月${day}日`;
}

/**
 * 完全な日時表示
 * 例: "2024年1月4日 10:30"
 */
export function formatFullDateTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes().toString().padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

/**
 * 詳細ページ用の日時表示
 * 例: "午前11:38", "2025年10月17日"
 */
export function formatDetailDateTime(date: Date | string): { time: string; date: string } {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours < 12 ? '午前' : '午後';
  const displayHours = hours % 12 || 12;
  
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  return {
    time: `${ampm}${displayHours}:${minutes}`,
    date: `${year}年${month}月${day}日`,
  };
}
