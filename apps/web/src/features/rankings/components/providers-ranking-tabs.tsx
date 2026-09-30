'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BadgeCheck } from 'lucide-react';
import { ProviderGroupSchema, type ProviderGroup, type ProviderRankingItem } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import { ProviderCover } from '@/features/connect/components/provider-cover';
import { RankBadge } from './ranking-parts';

/** Tab theo nhóm dịch vụ + danh sách top 5 của nhóm đang chọn. */
export function ProvidersRankingTabs({ byGroup, initialGroup = 'stay', emptyLabel }: { byGroup: Record<ProviderGroup, ProviderRankingItem[]>; initialGroup?: ProviderGroup; emptyLabel?: string }) {
  const t = useTranslations();
  const [group, setGroup] = useState<ProviderGroup>(initialGroup);
  const items = byGroup[group];
  return (
    <>
      <div className="no-scrollbar mt-4 flex gap-1 overflow-x-auto rounded-2xl bg-secondary p-1 text-xs font-semibold sm:grid sm:grid-cols-4" role="tablist">
        {ProviderGroupSchema.options.map((g) => (
          <button key={g} role="tab" aria-selected={group === g} onClick={() => setGroup(g)}
            className={`shrink-0 whitespace-nowrap rounded-xl px-3 py-2.5 transition ${group === g ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
            {t(`connect.${g}`)}
          </button>
        ))}
      </div>
      {items.length === 0 && emptyLabel && <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">{emptyLabel}</p>}
      <ol className="mt-4 space-y-3" role="tabpanel">
        {items.map(({ rank, provider: p, votes }) => (
          <li key={p.id}>
            <Link href={`/connect/${p.slug}`} className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-secondary/60">
              <RankBadge rank={rank} />
              <span className="size-10 shrink-0 overflow-hidden rounded-lg"><ProviderCover src={p.coverUrl} type={p.type} iconClass="size-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-sm font-semibold">
                  {p.name} {p.verified && <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label={t('connect.verified')} />}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {t(`connect.type.${p.type}`)} · {p.destination.name} · <span className="font-semibold text-foreground">{t('rankings.voters', { count: votes })}</span>
                </p>
              </div>
              <RatingPill avg={p.ratingAvg} votes={votes} />
            </Link>
          </li>
        ))}
      </ol>
      {items.length === 0 && <p className="mt-4 text-sm text-muted-foreground">{t('rankings.empty')}</p>}
    </>
  );
}
