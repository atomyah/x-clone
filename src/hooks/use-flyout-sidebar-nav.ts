'use client';

import { useSyncExternalStore } from 'react';

/**
 * サイドバーがアイコン列の幅かつ、指・スタイラス等の粗いポインタ想定（スマホ等）のとき true。
 * 狭いPCウィンドウ＋マウスは pointer: fine のため false → アイコン（リンク）クリックでそのまま遷移。
 * tailwind の lg（950px）と揃えて 949px 以下のみ対象。
 */
const FLYOUT_NAV_QUERY = '(max-width: 949px) and (pointer: coarse)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(FLYOUT_NAV_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(FLYOUT_NAV_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useFlyoutSidebarNav() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
