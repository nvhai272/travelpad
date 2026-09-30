'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

/** 5 ngôi sao chọn điểm (radiogroup) + nhãn mức độ khi rê chuột. */
export function StarInput({ value, onPick }: { value: number; onPick: (star: number) => void }) {
  const t = useTranslations('rating');
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const label = (s: number) => t(`l${s}` as 'l1');
  return (
    <div className="mt-2 flex items-center gap-3" onMouseLeave={() => setHover(0)}>
      <div className="flex gap-1" role="radiogroup" aria-label={t('yours')}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button" role="radio" aria-checked={value === s} aria-label={`${s} – ${label(s)}`}
            onMouseEnter={() => setHover(s)} onClick={() => onPick(s)} className="text-accent transition hover:scale-110">
            <Star className={`size-8 ${shown >= s ? 'fill-current' : 'text-border'}`} />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">{shown ? label(shown) : t('tap')}</span>
    </div>
  );
}
