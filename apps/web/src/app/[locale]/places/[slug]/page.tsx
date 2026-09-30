import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { serverApi, safe } from '@/lib/api';
import { StarVote } from '@/features/rating/components/star-vote';
import { EditorialHero } from '@/components/ui/editorial-hero';
import { PlaceInfoCard } from '@/features/places/components/place-info-card';
import { PlaceReviewList } from '@/features/places/components/place-review-list';
import { PlaceNextSteps } from '@/features/places/components/place-next-steps';
import { PlaceQuickBar } from '@/features/places/components/place-quick-bar';
import { placeJsonLd } from '@/features/places/place-json-ld';

type Props = { params: Promise<{ locale: string; slug: string }> };

const load = (slug: string) => safe(serverApi.places.bySlug(slug), null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const place = await load((await params).slug);
  if (!place) return {};
  return {
    title: `${place.name}, ${place.province}`,
    description: place.description.slice(0, 160),
    alternates: { canonical: `/places/${place.slug}`, languages: { vi: `/places/${place.slug}`, en: `/en/places/${place.slug}` } },
    openGraph: { images: place.coverUrl ? [place.coverUrl] : [] },
  };
}

export default async function PlacePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const place = await load(slug);
  if (!place) notFound();
  // BR-PLACE-06: điểm đến lớn không có đánh giá riêng – chỉ địa điểm cụ thể mới chấm sao & có nhận xét
  const ratable = place.kind === 'spot';
  const written = ratable ? await safe(serverApi.places.reviews(place.id), { items: [], nextCursor: null }) : { items: [] };

  return (
    <article className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd(place)) }} />
      <div className="space-y-4 lg:col-span-8">
        <EditorialHero image={place.coverUrl} imageAlt={place.name} title={place.name} lead={place.description}
          eyebrow={place.parent ? <Link href={`/places/${place.parent.slug}`} className="hover:underline">{place.parent.name}</Link> : place.province} />
        <PlaceQuickBar place={place} />
      </div>
      <aside id="reviews" className="scroll-mt-24 space-y-5 lg:sticky lg:top-24 lg:col-span-4 lg:row-span-2 lg:self-start">
        {ratable && <StarVote kind="place" targetId={place.id}
          initial={{ ratingAvg: place.ratingAvg, reviewCount: place.reviewCount, ratingDistribution: place.ratingDistribution }} />}
        <PlaceInfoCard place={place} />
        {/* TODO(TL-303): gallery */}
      </aside>
      <div className="space-y-5 lg:col-span-8">
        {/* Chuỗi cốt lõi trước (lịch trình → bản đồ gần đây → dịch vụ), nhận xét chi tiết sau */}
        <PlaceNextSteps place={place} />
        {ratable && <PlaceReviewList reviews={written.items} locale={locale} />}
      </div>
    </article>
  );
}
