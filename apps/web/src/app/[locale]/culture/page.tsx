import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { EditorialHero } from '@/components/ui/editorial-hero';
import { SectionHead } from '@/components/ui/section-head';
import { ScrollRow } from '@/components/ui/scroll-row';
import { RegionsSection } from '@/features/home/components/regions-section';
import { CultureCard } from '@/features/culture/components/culture-card';
import { CULTURE_GROUPS, CULTURE_TOPICS } from '@/features/culture/culture-topics';
import { ExploreTabs } from '@/features/explore/explore-tabs';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'culture' });
  return { title: t('eyebrow'), description: t('lead'), alternates: { canonical: '/culture' } };
}

/** Văn hóa Việt: ba miền + bốn nhóm chủ đề (biểu tượng, di sản, nghệ thuật & đời sống, ẩm thực). */
export default async function CulturePage({ params }: Props) {
  setRequestLocale((await params).locale);
  const t = await getTranslations('culture');
  return (
    <div className="space-y-9 sm:space-y-12">
      <div className="-mb-5 sm:-mb-8"><ExploreTabs active="/culture" /></div>
      <EditorialHero image="/images/culture/hoa-sen.jpg" imageAlt={t('topics.hoaSen.title')} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')}
        className="min-h-[360px] sm:min-h-[440px]">
        <nav className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {CULTURE_GROUPS.map((g) => (
            <a key={g} href={`#${g}`} className="shrink-0 rounded-full border border-hero-border bg-hero-surface px-3.5 py-2 text-xs font-medium backdrop-blur-md hover:bg-hero-surface-hover">
              {t(`groups.${g}`)}
            </a>
          ))}
        </nav>
      </EditorialHero>
      <RegionsSection />
      {CULTURE_GROUPS.map((g) => (
        <section key={g} id={g} className="scroll-mt-24">
          <SectionHead eyebrow={t(`groups.${g}`)} title={t(`groupSubs.${g}`)} />
          <ScrollRow gridClass="sm:grid-cols-2 lg:grid-cols-4" itemClass="w-[72%]">
            {CULTURE_TOPICS.filter((c) => c.group === g).map((c) => <CultureCard key={c.slug} topic={c} />)}
          </ScrollRow>
        </section>
      ))}
      <p className="text-xs text-muted-foreground">{t('note')}</p>
    </div>
  );
}
