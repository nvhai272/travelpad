import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { PlaceSummary } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';
import { Link } from '@/i18n/routing';
import { EditorialHero } from '@/components/ui/editorial-hero';
import { SectionHead } from '@/components/ui/section-head';
import { ScrollRow } from '@/components/ui/scroll-row';
import { CultureCard } from '@/features/culture/components/culture-card';
import { CultureWhere } from '@/features/culture/components/culture-where';
import { CULTURE_TOPICS, topicBySlug } from '@/features/culture/culture-topics';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const generateStaticParams = () => CULTURE_TOPICS.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) return {};
  const t = await getTranslations({ locale, namespace: 'culture' });
  return { title: t(`topics.${topic.key}.title`), description: t(`topics.${topic.key}.summary`), alternates: { canonical: `/culture/${slug}` } };
}

/** Một chủ đề văn hóa: ảnh lớn, tóm tắt, hai đoạn đọc nhanh, nơi trải nghiệm, chủ đề khác cùng nhóm. */
export default async function CultureTopicPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const topic = topicBySlug(slug);
  if (!topic) notFound();
  const t = await getTranslations('culture');
  const empty = { items: [] as PlaceSummary[], nextCursor: null };
  const [spots, dests] = await Promise.all([
    topic.places.length ? safe(serverApi.places.list({ kind: 'spot', sort: 'rating', limit: 50 }), empty) : empty,
    topic.destination ? safe(serverApi.places.list({ kind: 'destination', sort: 'featured', limit: 50 }), empty) : empty,
  ]);
  const places = topic.places.map((s) => spots.items.find((p) => p.slug === s)).filter((p): p is PlaceSummary => !!p);
  const destination = dests.items.find((d) => d.slug === topic.destination);
  const others = CULTURE_TOPICS.filter((c) => c.slug !== slug && c.group === topic.group);
  const k = topic.key;

  return (
    <div className="space-y-9 sm:space-y-12">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <article className="space-y-5 lg:col-span-8">
          <EditorialHero image={topic.image} imageAlt={t(`topics.${k}.title`)} title={t(`topics.${k}.title`)} lead={t(`topics.${k}.summary`)}
            eyebrow={<Link href={`/culture#${topic.group}`} className="hover:underline">{t('eyebrow')} · {t(`groups.${topic.group}`)}</Link>} />
          <div className="max-w-2xl space-y-4 text-base leading-8 sm:text-[17px]">
            <p>{t(`topics.${k}.body1`)}</p>
            <p>{t(`topics.${k}.body2`)}</p>
          </div>
          <p className="max-w-2xl border-t border-border pt-3 text-xs text-muted-foreground">{t('note')}</p>
        </article>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24"><CultureWhere topic={topic} places={places} destination={destination} /></div>
        </div>
      </div>
      {others.length > 0 && (
        <section>
          <SectionHead eyebrow={t(`groups.${topic.group}`)} title={t('moreTopics')} href="/culture" cta={t('seeAll')} />
          <ScrollRow gridClass="sm:grid-cols-2 lg:grid-cols-4" itemClass="w-[72%]">
            {others.map((c) => <CultureCard key={c.slug} topic={c} />)}
          </ScrollRow>
        </section>
      )}
    </div>
  );
}
