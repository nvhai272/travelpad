import { getTranslations } from 'next-intl/server';
import { ArrowRight, BadgeCheck, CalendarRange, Handshake, HeartHandshake, Landmark } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { EditorialHero } from '@/components/ui/editorial-hero';
import { ProviderSignupCta } from '@/features/provider-signup/components/provider-signup-cta';

/** Giới thiệu – khối đầu trang chủ (chứa <h1>): TravelPad là gì · 3 trụ cột (lịch trình, dịch vụ, văn hóa) · điều theo đuổi · mời nhà cung cấp. */
export async function AboutSection() {
  const t = await getTranslations('about');
  const steps = [
    { icon: CalendarRange, title: t('s1Title'), body: t('s1Body'), cta: t('s1Cta'), href: '/itinerary' },
    { icon: Handshake, title: t('s2Title'), body: t('s2Body'), cta: t('s2Cta'), href: '/connect' },
    { icon: Landmark, title: t('s3Title'), body: t('s3Body'), cta: t('s3Cta'), href: '/culture' },
  ];
  const values = [
    { icon: BadgeCheck, title: t('healthyTitle'), body: t('healthyBody') },
    { icon: HeartHandshake, title: t('localTitle'), body: t('localBody') },
  ];
  const card = 'rounded-2xl border border-border bg-card p-5 shadow-editorial';
  const badge = 'grid size-11 shrink-0 place-items-center rounded-full';
  return (
    <section id="about" className="scroll-mt-24 space-y-9 sm:space-y-12">
      {/* Lật ảnh để người chèo thuyền sang phải, chữ nằm trên mặt nước */}
      <EditorialHero as="h1" image="/images/culture/hoa-sen.jpg" imageAlt={t('title')} imageClassName="[transform:scaleX(-1)]"
        eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} size="sm" leadClassName="max-w-xl lg:max-w-none" className="min-h-[340px] sm:min-h-[440px]">
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link href="/itinerary" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground [text-shadow:none]">
            {t('plan')} <ArrowRight className="size-4" />
          </Link>
          <Link href="/map" className="inline-flex h-11 items-center rounded-full border border-current/40 bg-white/15 px-5 text-sm font-semibold backdrop-blur-sm">
            {t('start')}
          </Link>
        </div>
      </EditorialHero>

      <section>
        <h2 className="mb-4 font-display text-2xl font-medium sm:text-3xl">{t('howTitle')}</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body, cta, href }, i) => (
            <li key={href}>
              <Link href={href} className={`${card} group flex h-full flex-col gap-3 transition hover:border-primary/40`}>
                <span className="flex items-center gap-3">
                  <span className={`${badge} bg-primary text-primary-foreground`}><Icon className="size-5" /></span>
                  <span className="font-display text-xl font-medium"><span className="text-accent">{i + 1}.</span> {title}</span>
                </span>
                <span className="text-sm leading-6 text-muted-foreground">{body}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary">
                  {cta} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-medium sm:text-3xl">{t('missionTitle')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className={`${card} flex flex-col gap-3 sm:flex-row sm:gap-4`}>
              <span className={`${badge} bg-primary/10 text-primary`}><Icon className="size-5" /></span>
              <div>
                <h3 className="font-display text-xl font-medium">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-medium sm:text-3xl">{t('providerTitle')}</h2>
        <ProviderSignupCta />
      </section>
    </section>
  );
}
