'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/routing';

/** Ô tìm trên trang Kết nối – giữ nguyên các bộ lọc khác trên URL. */
export function ConnectSearch({ params }: { params: Record<string, string | undefined> }) {
  const t = useTranslations('connect');
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(params.q ?? '');
  const submit = () => {
    const next = new URLSearchParams(Object.entries({ ...params, q }).filter(([, v]) => v) as [string, string][]);
    router.push(`${pathname}${next.size ? `?${next}` : ''}`);
  };
  return (
    <label className="relative block">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} onBlur={submit}
        placeholder={t('search')} aria-label={t('search')}
        className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
    </label>
  );
}
