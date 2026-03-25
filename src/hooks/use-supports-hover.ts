'use client';

import { useSyncExternalStore } from 'react';

/** マウス等でホバーが有効か（タッチ主体の端末では false になりやすい） */
const HOVER_MEDIA_QUERY = '(hover: hover)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(HOVER_MEDIA_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(HOVER_MEDIA_QUERY).matches;
}

/** SSR ではホバー不可とみなし、クライアントで上書き（チラつき最小化） */
function getServerSnapshot() {
  return false;
}

export function useSupportsHover() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
