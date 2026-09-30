'use client';

import { useTranslations } from 'next-intl';
import { Settings } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { useApp } from '@/features/app/app-provider';
import { SITE_NAME } from '@/lib/site';
import { BrandLockup } from '@/components/brand/brand-mark';

/** Menu chính chỉ 2 mục (chốt 27/09): Trang chủ (gồm giới thiệu) · Khám phá Việt Nam (Địa điểm · Lịch trình · Dịch vụ · Văn hóa). */
export const EXPLORE_PATHS = ['/map', '/places', '/itinerary', '/connect', '/culture'];
export const NAV = [
  { key: 'home', href: '/', match: [] as string[] },
  { key: 'exploreVn', href: '/map', match: EXPLORE_PATHS },
] as const;

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const { user, signedIn, openAuth, setSettingsOpen } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1480px] items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:h-20 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={SITE_NAME}>
          <BrandLockup tagline={t('brand.tagline')} />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label={t('nav.explore')}>
          {NAV.map((n) => {
            const active = n.match.length ? n.match.some((m) => pathname.startsWith(m)) : pathname === '/';
            return (
              <Link key={n.key} href={n.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                {t(`nav.${n.key}`)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {signedIn && user ? (
            <>
              {/* Chuông thông báo: ẩn tới khi có chức năng thật (TL-703) – không hiện số giả */}
              <Link href={`/u/${user.username}`} className="hidden shrink-0 items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 lg:flex">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.displayName} className="size-8 rounded-full object-cover" />
                ) : (
                  <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{user.displayName[0]}</span>
                )}
                <span className="hidden text-sm font-medium sm:inline">{user.displayName}</span>
              </Link>
            </>
          ) : (
            <button onClick={openAuth} className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground lg:py-2.5">
              {t('nav.signIn')}
            </button>
          )}
          {/* Cài đặt đứng cuối, sau Đăng nhập / avatar */}
          <button onClick={() => setSettingsOpen(true)} aria-label={t('nav.settings')}
            className="hidden size-10 shrink-0 place-items-center rounded-full border border-border bg-card lg:grid">
            <Settings className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
