import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SITE_NAME } from '@/lib/site';
import { BrandLockup } from '@/components/brand/brand-mark';
import { DongSonPattern } from '@/components/brand/dong-son-pattern';
import { VnFlag } from '@/components/brand/vn-flag';

/** Footer: giới thiệu ngắn + điều hướng phụ (desktop 4 cột; điện thoại gọn, chừa chỗ thanh tab). */
export async function SiteFooter() {
  const t = await getTranslations();
  const groups = [
    { title: t('nav.exploreVn'), links: [['/map', t('nav.placesTab')], ['/itinerary', t('nav.itineraryTab')], ['/connect', t('nav.connect')], ['/culture', t('nav.culture')]] },
    { title: SITE_NAME, links: [['/#about', t('nav.about')], ['/credits', t('footer.photoCredits')]] },
    { title: t('footer.business'), links: [['/connect/register', t('providerSignup.cta')], ['/me/providers', t('myProviders.title')]] },
  ] as const;
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-border bg-secondary/40">
      <DongSonPattern className="pointer-events-none absolute -right-24 -top-24 size-80 text-accent/[0.07] lg:size-[26rem]" />
      <div className="relative mx-auto grid max-w-[1480px] grid-cols-2 gap-6 px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 lg:grid-cols-5 lg:px-10 lg:pb-10">
        <div className="col-span-2">
          <p><BrandLockup size="sm" /></p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{t('footer.about')}</p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title} className="text-sm">
            <p className="mb-2 font-semibold">{g.title}</p>
            <ul className="space-y-2 text-muted-foreground">
              {g.links.map(([href, label]) => <li key={href}><Link href={href} className="hover:text-foreground">{label}</Link></li>)}
            </ul>
          </nav>
        ))}
        <p className="col-span-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground lg:col-span-5">
          <span>© {new Date().getFullYear()} {SITE_NAME}. {t('footer.rights')}</span>
          <span className="inline-flex items-center gap-1.5"><VnFlag className="h-3 w-[18px]" /> {t('footer.madeIn')}</span>
        </p>
      </div>
    </footer>
  );
}
