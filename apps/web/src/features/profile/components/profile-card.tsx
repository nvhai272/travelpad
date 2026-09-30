'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useApp } from '@/features/app/app-provider';
import { UserAvatar } from '@/features/rankings/components/ranking-parts';
import { useFollowing } from '@/features/follow/following-provider';

/** Thẻ cá nhân (thành viên): chào, cấp độ, đánh giá / người theo dõi / đang theo dõi, lối vào dịch vụ & quản trị. */
export function ProfileCard() {
  const t = useTranslations();
  const { user } = useApp();
  const { count: followingCount } = useFollowing();
  if (!user) return null;
  const stats = [
    ['reviews', user.stats.reviews, `/u/${user.username}`],
    ['followers', user.stats.followers, `/u/${user.username}`],
    ['followingStat', followingCount, '/following'],
  ] as const;
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <Link href={`/u/${user.username}`} className="flex items-center gap-3">
        <UserAvatar user={user} size={48} />
        <div>
          <h2 className="font-display text-xl font-medium">{t('profile.hello', { name: user.displayName })}</h2>
          <p className="text-xs text-muted-foreground">{t(`rankings.accountType.${user.accountType}`)} · {t('profile.travelerLevel', { level: user.level })}</p>
        </div>
      </Link>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {stats.map(([k, v, href]) => (
          <Link key={k} href={href} className="rounded-xl border border-border bg-background/60 py-3 transition hover:border-primary/40">
            <p className="font-display text-xl font-semibold">{v}</p>
            <p className="text-[11px] text-muted-foreground">{t(`profile.${k}`)}</p>
          </Link>
        ))}
      </div>
      {/* Lối vào quản lý dịch vụ & duyệt (BR-CONN-06, 11) */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-sm font-semibold">
        <Link href="/me/providers" className="text-primary">{t('myProviders.title')}</Link>
        {(user.role === 'ADMIN' || user.role === 'MODERATOR') && <Link href="/admin/providers" className="text-primary">{t('admin.title')}</Link>}
      </div>
    </section>
  );
}
