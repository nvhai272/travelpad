import type { PlaceSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';

/** Thẻ địa điểm: ảnh 16:10, chip vùng, tiêu đề serif, số review, huy hiệu sao ấm. */
export function PlaceCard({ place, regionLabel, reviewsLabel, newLabel }: { place: PlaceSummary; regionLabel: string; reviewsLabel: string; newLabel: string }) {
  return (
    <Link href={`/places/${place.slug}`} className="block">
      <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-editorial">
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
          {place.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.coverUrl} alt={`${place.name}, ${regionLabel}`} loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          )}
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">{regionLabel}</span>
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-display text-xl font-medium">{place.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{reviewsLabel}</p>
          </div>
          <RatingPill avg={place.ratingAvg} votes={place.reviewCount} newLabel={newLabel} />
        </div>
      </article>
    </Link>
  );
}
