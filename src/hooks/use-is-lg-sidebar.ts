'use client';

import { useSyncExternalStore } from 'react';

/** Tailwind の `lg`（tailwind.config.ts の screens.lg）と揃える */
const LG_MIN_WIDTH_QUERY = '(min-width: 950px)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(LG_MIN_WIDTH_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(LG_MIN_WIDTH_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsLgSidebar() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
