import { getWebhookSyncStatus } from '@/lib/users';

export async function WebhookSyncStatus() {
  const status = await getWebhookSyncStatus();

  if (!status.isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80">
      <span className="hidden sm:inline">Webhook同期状態</span>
      <span
        className={
          status.isSynced
            ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400'
            : 'rounded-full bg-rose-500/15 px-2 py-0.5 font-medium text-rose-600 dark:text-rose-400'
        }
      >
        {status.isSynced ? '同期済み' : '未同期'}
      </span>
    </div>
  );
}
