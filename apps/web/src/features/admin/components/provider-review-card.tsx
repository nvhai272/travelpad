'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ApiClientError } from '@travelpad/api-client';
import type { AdminProvider } from '@travelpad/contracts';
import { inputClass } from '@/components/ui/form-field';
import { browserApi } from '@/lib/browser-api';

/** Một hồ sơ chờ duyệt: thông tin để xác minh + Duyệt (kèm "Đã xác minh") / Từ chối (kèm lý do). */
export function ProviderReviewCard({ p, onDone }: { p: AdminProvider; onDone: (id: string) => void }) {
  const t = useTranslations();
  const [verified, setVerified] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const act = async (fn: () => Promise<unknown>) => {
    setError(null);
    try { await fn(); onDone(p.id); } catch (e) { setError(e instanceof ApiClientError ? e.error.message : 'Error'); }
  };

  return (
    <li className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <p className="font-display text-xl font-medium">{p.name}</p>
      <p className="text-xs text-muted-foreground">{t(`connect.type.${p.type}`)} · {p.destination.name} · {p.address ?? ''}</p>
      <p className="mt-2 text-sm leading-6">{p.description}</p>
      <dl className="mt-3 grid grid-cols-1 gap-1 text-sm sm:grid-cols-3">
        <div><dt className="text-xs text-muted-foreground">{t('admin.owner')}</dt><dd>{p.owner?.displayName ?? '—'}</dd></div>
        <div><dt className="text-xs text-muted-foreground">{t('admin.license')}</dt><dd className="font-mono">{p.licenseNumber ?? '—'}</dd></div>
        <div><dt className="text-xs text-muted-foreground">{t('admin.phone')}</dt><dd>{p.phone}</dd></div>
      </dl>
      {p.status === 'pending' && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="size-4" /> {t('admin.verified')}
          </label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder={t('admin.reasonPlaceholder')} className={inputClass} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => act(() => browserApi.adminProviders.approve(p.id, { verified }))}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{t('admin.approve')}</button>
            <button onClick={() => act(() => browserApi.adminProviders.reject(p.id, { reason }))}
              className="rounded-full border border-destructive px-5 py-2 text-sm font-semibold text-destructive">{t('admin.reject')}</button>
          </div>
        </div>
      )}
    </li>
  );
}
