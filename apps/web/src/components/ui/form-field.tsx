import type { ReactNode } from 'react';

export const inputClass =
  'mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 aria-[invalid=true]:border-destructive';

/** Nhãn + ô nhập + gợi ý/lỗi. Ô nhập truyền qua children (input, select, textarea). */
export function FormField({ label, error, hint, children, className = '' }: { label: string; error?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block text-xs font-semibold text-muted-foreground ${className}`}>
      {label}
      {children}
      {error ? <span className="mt-1 block font-normal text-destructive">{error}</span> : hint && <span className="mt-1 block font-normal">{hint}</span>}
    </label>
  );
}
