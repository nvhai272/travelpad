import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';
import type { Review } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { Avatar } from '@/components/ui/avatar';

/** Nhận xét gần đây (chỉ vote có kèm nội dung – BR-REV-02). */
export async function PlaceReviewList({ reviews, locale }: { reviews: Review[]; locale: string }) {
  const t = await getTranslations();
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <h2 className="font-display text-2xl font-medium">{t('rating.written')}</h2>
      <ul className="mt-4 divide-y divide-border">
        {reviews.map((r) => (
          <li key={r.id} className="py-4 first:pt-0">
            <div className="flex items-center gap-2 text-sm">
              <Avatar user={r.author} size={28} />
              <Link href={`/u/${r.author.username}`} className="font-semibold hover:underline">{r.author.displayName}</Link>
              <span className="flex items-center gap-0.5 text-accent" aria-label={`${r.rating}/5`}>
                {Array.from({ length: r.rating }, (_, i) => <Star key={i} className="size-3 fill-current" />)}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString(locale)}</span>
            </div>
            <p className="mt-2 text-sm leading-6">{r.content}</p>
            {/* TODO(TL-307): nút "Hữu ích" */}
            {r.helpfulCount > 0 && <p className="mt-1 text-xs text-muted-foreground">{t('rankings.helpful', { count: r.helpfulCount })}</p>}
          </li>
        ))}
      </ul>
      {reviews.length === 0 && <p className="mt-3 text-sm text-muted-foreground">{t('rating.noWritten')}</p>}
    </section>
  );
}
