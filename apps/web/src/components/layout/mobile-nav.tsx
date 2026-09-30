'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Compass, Home, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { useApp } from '@/features/app/app-provider';
import { UserAvatar } from '@/features/rankings/components/ranking-parts';
import { MeSheet } from './me-sheet';
import { EXPLORE_PATHS } from './site-header';

// Menu 2 mục + "Tôi" – khớp header (Trang chủ · Khám phá Việt Nam)
const TABS: { key: 'home' | 'mapShort'; href: string; match: string[]; icon: LucideIcon }[] = [
  { key: 'home', href: '/', match: [], icon: Home },
  { key: 'mapShort', href: '/map', match: EXPLORE_PATHS, icon: Compass },
];

/** Thanh tab dưới đáy cho điện thoại (ẩn từ lg): 2 mục menu + "Tôi". Chừa vùng an toàn của iPhone. */
export function MobileNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user } = useApp();
  const [meOpen, setMeOpen] = useState(false);
  const isActive = (match: string[]) => (match.length ? match.some((m) => pathname.startsWith(m)) : pathname === '/');
  const cls = (active: boolean) =>
    `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`;

  return (
    <>
      <nav aria-label={t('explore')}
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {TABS.map(({ key, href, match, icon: Icon }) => (
          <Link key={key} href={href} aria-current={isActive(match) ? 'page' : undefined} className={cls(isActive(match))}>
            <Icon className="size-[22px]" strokeWidth={isActive(match) ? 2.4 : 1.8} />
            {t(key)}
          </Link>
        ))}
        <button onClick={() => setMeOpen(true)} className={cls(meOpen || pathname.startsWith('/u/') || pathname.startsWith('/me') || pathname === '/following')}>
          {user ? <UserAvatar user={user} size={24} /> : <UserRound className="size-[22px]" strokeWidth={1.8} />}
          {t('me')}
        </button>
      </nav>
      <MeSheet open={meOpen} onClose={() => setMeOpen(false)} />
    </>
  );
}
