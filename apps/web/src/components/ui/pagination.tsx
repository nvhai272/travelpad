'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

/** `basePath`: tạo link ?page=N (trang render server, SEO). `onPage`: callback cho danh sách tải phía client. */
type Props = { page: number; totalPages: number } & ({ basePath: string; onPage?: never } | { onPage: (page: number) => void; basePath?: never });

/** Phân trang theo số trang: dùng link (trang SEO) hoặc callback (danh sách tải phía client). */
export function Pagination({ page, totalPages, basePath, onPage }: Props) {
  const t = useTranslations('stories');
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  const cls = (active: boolean) => `grid size-9 place-items-center rounded-full text-sm font-semibold ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`;
  const Item = ({ p, children, label }: { p: number; children: React.ReactNode; label?: string }) =>
    basePath !== undefined ? <Link href={p > 1 ? `${basePath}${basePath.includes('?') ? '&' : '?'}page=${p}` : basePath} aria-label={label} className={cls(p === page && !label)}>{children}</Link>
      : <button type="button" onClick={() => onPage!(p)} aria-label={label} className={cls(p === page && !label)}>{children}</button>;

  return (
    <nav className="mt-6 flex items-center justify-center gap-1" aria-label={t('pageOf', { page, total: totalPages })}>
      {page > 1 && <Item p={page - 1} label={t('prev')}><ChevronLeft className="size-4" /></Item>}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1">
          {i > 0 && p - pages[i - 1]! > 1 && <span className="px-1 text-muted-foreground">…</span>}
          <Item p={p}>{p}</Item>
        </span>
      ))}
      {page < totalPages && <Item p={page + 1} label={t('next')}><ChevronRight className="size-4" /></Item>}
    </nav>
  );
}
