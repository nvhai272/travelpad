import { getTranslations } from 'next-intl/server';
import { CalendarRange, Handshake, Map, Star } from 'lucide-react';
import type { PlaceDetail } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';

/**
 * Thanh lối tắt ngay dưới ảnh: đánh giá · lên lịch trình · bản đồ · dịch vụ – bốn việc chính khi xem một địa điểm.
 * Vuốt ngang trên điện thoại.
 */
export async function PlaceQuickBar({ place }: { place: PlaceDetail }) {
  const t = await getTranslations();
  const dest = place.parent?.slug ?? place.slug;
  const pill = 'flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition hover:border-primary/40';
  return (
    <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {/* Điểm đến không có đánh giá riêng (BR-PLACE-06) */}
      {place.kind === 'spot' && (
        <a href="#reviews" className={pill}>
          <Star className="size-4 fill-rating-foreground text-rating-foreground" />
          {place.reviewCount > 0 ? `${place.ratingAvg.toFixed(1)} · ${t('place.votes', { count: place.reviewCount })}` : t('next.reviewsAnchor')}
        </a>
      )}
      <Link href={`/itinerary?destination=${dest}&days=2`} className={`${pill} border-primary bg-primary text-primary-foreground hover:border-primary`}>
        <CalendarRange className="size-4" /> {t('next.addToTrip')}
      </Link>
      <a href="#nearby" className={pill}><Map className="size-4 text-primary" /> {t('next.onMap')}</a>
      <a href="#services" className={pill}><Handshake className="size-4 text-primary" /> {t('nav.connect')}</a>
    </nav>
  );
}
