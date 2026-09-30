import { getFormatter, getTranslations } from 'next-intl/server';
import { BadgeCheck, Languages, MapPin, Phone } from 'lucide-react';
import type { ProviderSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import { ProviderCover } from './provider-cover';

const UNIT = { night: 'perNight', day: 'perDay', trip: 'perTrip', person: 'perPerson' } as const;

export async function PriceFrom({ p }: { p: Pick<ProviderSummary, 'priceFrom' | 'priceUnit'> }) {
  const t = await getTranslations('connect');
  const f = await getFormatter();
  return (
    <span>
      {t('from', { price: f.number(p.priceFrom, { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }) })}
      <span className="text-muted-foreground">{t(UNIT[p.priceUnit])}</span>
    </span>
  );
}

/** Thẻ nhà cung cấp: điện thoại là hàng ngang gọn (ảnh vuông bên trái), từ `sm` là thẻ dọc ảnh 16:9. */
export async function ProviderCard({ p }: { p: ProviderSummary }) {
  const t = await getTranslations('connect');
  const tPlace = await getTranslations('place');
  return (
    <Link href={`/connect/${p.slug}`} className="block h-full">
      <article className="group flex h-full overflow-hidden rounded-2xl border border-border bg-card shadow-editorial transition hover:border-primary/40 sm:block">
        <div className="relative w-28 shrink-0 overflow-hidden bg-secondary sm:aspect-[16/9] sm:w-auto">
          <ProviderCover src={p.coverUrl} type={p.type} iconClass="size-8 sm:size-12" className="transition duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 hidden rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur sm:block">{t(`type.${p.type}`)}</span>
          {p.verified && (
            <span className="absolute right-3 top-3 hidden items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground sm:flex">
              <BadgeCheck className="size-3.5" /> {t('verified')}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1 p-3 sm:space-y-1.5 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-display text-lg font-medium leading-tight sm:text-xl">
              {p.name}
              {p.verified && <BadgeCheck aria-label={t('verified')} className="ml-1 inline size-4 text-primary sm:hidden" />}
            </h3>
            <RatingPill avg={p.ratingAvg} votes={p.reviewCount} newLabel={tPlace('new')} />
          </div>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" /> <span className="sm:hidden">{t(`type.${p.type}`)} · </span>{p.destination.name}<span className="hidden sm:inline"> · {p.destination.province}</span>
          </p>
          {p.languages.length > 0 && (
            <p className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex"><Languages className="size-3.5" /> {t('languages', { list: p.languages.join(', ').toUpperCase() })}</p>
          )}
          <div className="flex items-center justify-between pt-1 text-sm font-semibold sm:pt-2">
            <PriceFrom p={p} />
            <span className="hidden items-center gap-1 text-xs font-normal text-muted-foreground sm:flex"><Phone className="size-3" /> {p.maskedPhone}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
