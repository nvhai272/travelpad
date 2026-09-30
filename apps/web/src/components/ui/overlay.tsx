'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

/** Lớp phủ dùng chung cho Dialog (giữa màn hình) và Sheet (trượt từ phải). Esc để đóng. */
/** Lớp phủ: `dialog` giữa màn hình, `sheet` trượt từ phải (desktop), `bottom` trượt từ dưới lên (điện thoại). Esc để đóng. */
export function Overlay({
  open, onClose, variant, label, children,
}: { open: boolean; onClose: () => void; variant: 'dialog' | 'sheet' | 'bottom'; label: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={label}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={
          {
            dialog: 'absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card p-6 shadow-mobile animate-scale-in',
            sheet: 'absolute inset-y-0 right-0 w-full overflow-y-auto bg-card p-6 shadow-mobile sm:max-w-md',
            bottom: 'absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-card px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-mobile animate-slide-up',
          }[variant]
        }
      >
        {variant === 'bottom' && <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" aria-hidden />}
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary">
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
