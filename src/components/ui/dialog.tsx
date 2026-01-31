// モーダル表示用のDialogコンポーネント
// オーバーレイとアニメーション対応
// app/profile/[username]/@modal/(.)edit/page.tsxで呼ばれる

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  const router = useRouter();
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      router.back();
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => handleOpenChange(false)}
          />
          {/* コンテンツ */}
          {children}
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  className,
  onClose,
  children,
  ...props
}: DialogContentProps) {
  const { onOpenChange } = React.useContext(DialogContext);
  const router = useRouter();

  const handleClose = () => {
    onClose?.();
    router.back();
    onOpenChange(false);
  };

  return (
    <div
      className={cn(
        'relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0a0a0a] text-foreground rounded-lg shadow-xl border border-border animate-in fade-in-0 zoom-in-95 duration-200',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10"
        onClick={handleClose}
      >
        <X className="h-4 w-4" />
      </Button>
      {children}
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}
