'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import type { MyProvider } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { browserApi } from '@/lib/browser-api';
import { useApp } from '@/features/app/app-provider';
import { MemberGate } from '@/features/app/member-gate';

const STATUS_TONE: Record<MyProvider['status'], string> = {
  pending: 'bg-rating text-rating-foreground', active: 'bg-primary/10 text-primary',
  rejected: 'bg-destructive/10 text-destructive', suspended: 'bg-secondary text-muted-foreground',
};

/** "Dịch vụ của tôi": trạng thái duyệt, lý do từ chối, sửa & gửi lại (BR-CONN-06). */
export function MyProviderList({ justSubmitted }: { justSubmitted: boolean }) {
  const t = useTranslations();
  const { signedIn } = useApp();
  const [items, setItems] = useState<MyProvider[] | null>(null);

  useEffect(() => {
    if (signedIn) browserApi.myProviders.list().then((r) => setItems(r.items)).catch(() => setItems([]));
  }, [signedIn]);

  return (
    <MemberGate message={t('myProviders.loginRequired')}>
      {justSubmitted && <p className="mb-4 rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary">{t('myProviders.submitted')}</p>}
      <ul className="space-y-3">
        {items?.map((p) => (
          <li key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-editorial">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-display text-xl font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{t(`connect.type.${p.type}`)} · {p.destination.name}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_TONE[p.status]}`}>{t(`myProviders.status.${p.status}`)}</span>
            </div>
            {p.status === 'rejected' && p.rejectReason && (
              <p className="mt-2 text-sm text-destructive">{t('myProviders.rejectReason', { reason: p.rejectReason })}</p>
            )}
            <div className="mt-3 flex gap-4 text-sm font-semibold">
              {(p.status === 'pending' || p.status === 'rejected') && <Link href={`/me/providers/${p.id}`} className="text-primary">{t('myProviders.edit')}</Link>}
              {p.status === 'active' && <Link href={`/connect/${p.slug}`} className="text-primary">{t('myProviders.view')}</Link>}
            </div>
          </li>
        ))}
      </ul>
      {items?.length === 0 && <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t('myProviders.empty')}</p>}
      <Link href="/connect/register" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        <Plus className="size-4" /> {t('myProviders.add')}
      </Link>
    </MemberGate>
  );
}
