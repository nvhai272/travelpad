'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { Chip, ChipGroup } from '@/components/ui/chip';
import { CATEGORIES, CATEGORY_EMOJI, REGIONS, type SearchFilters } from '../filters';
import { RegionIcon } from './region-icon';

/** Bộ lọc cố định: khu vực, loại, mức giá, sao tối thiểu (BR-MAP-06). */
export function PlaceFilters({ value: f, onChange }: { value: SearchFilters; onChange: (f: SearchFilters) => void }) {
  const t = useTranslations();
  const set = (patch: Partial<SearchFilters>) => onChange({ ...f, ...patch });
  return (
    <div className="space-y-3">
      <ChipGroup label={t('search.region')}>
        <Chip active={f.region === 'all'} onClick={() => set({ region: 'all' })}>{t('search.any')}</Chip>
        {REGIONS.map((r) => (
          <Chip key={r} active={f.region === r} onClick={() => set({ region: r })}>
            <span className="flex items-center gap-1.5"><RegionIcon region={r} className="size-4" />{t(`region.${r}`)}</span>
          </Chip>
        ))}
      </ChipGroup>
      <ChipGroup label={t('search.type')}>
        <Chip active={f.category === 'all'} onClick={() => set({ category: 'all' })}>{t('search.any')}</Chip>
        {CATEGORIES.map((c) => <Chip key={c} active={f.category === c} onClick={() => set({ category: c })}>{CATEGORY_EMOJI[c]} {t(`category.${c}`)}</Chip>)}
      </ChipGroup>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChipGroup label={t('search.price')}>
          <Chip active={f.price === 0} onClick={() => set({ price: 0 })}>{t('search.any')}</Chip>
          {([1, 2, 3] as const).map((p) => <Chip key={p} active={f.price === p} onClick={() => set({ price: p })}>{'₫'.repeat(p)}</Chip>)}
        </ChipGroup>
        <ChipGroup label={t('search.rating')}>
          <Chip active={f.minRating === 0} onClick={() => set({ minRating: 0 })}>{t('search.any')}</Chip>
          {([4, 4.5] as const).map((r) => (
            <Chip key={r} active={f.minRating === r} onClick={() => set({ minRating: r })}>
              <span className="flex items-center gap-1"><Star className="size-3 fill-current" />{r}+</span>
            </Chip>
          ))}
        </ChipGroup>
      </div>
    </div>
  );
}
