// リポストアイコンを出現するリポストボタン。このボタンをクリックするとリポストモーダルが表示される。
// ```
// 1. リポストボタンをクリック
//    ↓
// 2. ポップアップメニューが表示される
//    ↓
// 3. 「リポスト」をクリック
//    ↓
// 4. メニューが閉じて、引用リポストモーダルが開く
//    ↓
// 5. モーダルで引用コメントを入力してリポスト

'use client';

import { useEffect, useRef, useState } from 'react';
import { Repeat2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuoteRepostModal } from '@/components/home/quote-repost-modal';

interface QuoteRepostButtonProps {
  postId?: string;
  retweets: number;
  quotedToUsername: string;
  quotedToName: string;
  quotedToContent: string;
  quotedToAvatar?: string;
}

export function QuoteRepostButton({
  postId,
  retweets,
  quotedToUsername,
  quotedToName,
  quotedToContent,
  quotedToAvatar,
}: QuoteRepostButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const hasValidPost = Boolean(postId);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-2 hover:text-green-600 hover:bg-green-600/10"
        title="リポスト"
        disabled={!hasValidPost}
        onClick={(e) => {
          e.stopPropagation();
          if (!hasValidPost) return;
          setIsMenuOpen((prev) => !prev);
        }}
      >
        <Repeat2 className="w-4 h-4" />
        <span>{retweets}</span>
      </Button>

      {isMenuOpen && hasValidPost && (
        <div
          className="absolute z-20 top-full left-0 mt-1 min-w-[120px] rounded-md p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-full rounded-md border-0 bg-background px-3 py-2 text-left text-sm font-medium shadow-md transition-all duration-150 hover:bg-muted hover:shadow-xl active:translate-y-px"
            onClick={() => {
              setIsMenuOpen(false);
              setIsQuoteModalOpen(true);
            }}
          >
            リポスト
          </button>
        </div>
      )}

      {hasValidPost && postId && (
        <QuoteRepostModal
          open={isQuoteModalOpen}
          onOpenChange={setIsQuoteModalOpen}
          quotedPostId={postId}
          quotedToUsername={quotedToUsername}
          quotedToName={quotedToName}
          quotedToContent={quotedToContent}
          quotedToAvatar={quotedToAvatar}
        />
      )}
    </div>
  );
}
