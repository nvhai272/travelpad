'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProviderStatusSchema, type AdminProvider, type ProviderStatus } from '@travelpad/contracts';
import { browserApi } from '@/lib/browser-api';
import { useApp } from '@/features/app/app-provider';
import { MemberGate } from '@/features/app/member-gate';
import { ProviderReviewCard } from './provider-review-card';

/** Trang quản trị: hồ sơ nhà cung cấp theo trạng thái (mặc định Chờ duyệt). API chặn người không có quyền. */
export function ProviderQueue() {
  const t = useTranslations();
  const { user } = useApp();
  const [status, setStatus] = useState<ProviderStatus>('pending');
  const [items, setItems] = useState<AdminProvider[] | null>(null);
  const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

  useEffect(() => {
    if (isStaff) browserApi.adminProviders.list(status).then((r) => setItems(r.items)).catch(() => setItems([]));
  }, [isStaff, status]);

  return (
    <MemberGate message={t('admin.forbidden')}>
      {!isStaff ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t('admin.forbidden')}</p>
      ) : (
        <>
          <div className="mb-4 inline-flex rounded-full bg-secondary p-1 text-xs font-semibold" role="tablist">
            {ProviderStatusSchema.options.map((s) => (
              <button key={s} role="tab" aria-selected={status === s} onClick={() => setStatus(s)}
                className={`rounded-full px-4 py-2 ${status === s ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                {t(`myProviders.status.${s}`)}
              </button>
            ))}
          </div>
          <ul className="space-y-4">
            {items?.map((p) => <ProviderReviewCard key={p.id} p={p} onDone={(id) => setItems((cur) => cur?.filter((x) => x.id !== id) ?? null)} />)}
          </ul>
          {items?.length === 0 && <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t('admin.empty')}</p>}
        </>
      )}
    </MemberGate>
  );
}
