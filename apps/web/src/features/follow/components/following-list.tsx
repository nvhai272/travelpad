'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { UserSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { browserApi } from '@/lib/browser-api';
import { UserAvatar } from '@/features/rankings/components/ranking-parts';
import { useFollowing } from '../following-provider';
import { FollowButton } from './follow-button';

/** Những người tôi đang theo dõi – bỏ theo dõi ngay tại chỗ. */
export function FollowingList() {
  const t = useTranslations();
  const { count } = useFollowing();
  const [people, setPeople] = useState<UserSummary[] | null>(null);

  // Chỉ tải khi mở trang; người vừa bỏ theo dõi vẫn giữ trong danh sách (hiện nút "Theo dõi") để có thể hoàn tác
  useEffect(() => { browserApi.follows.following().then((r) => setPeople(r.items)).catch(() => setPeople([])); }, []);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <h2 className="font-display text-2xl font-medium">{t('follow.listTitle')} <span className="text-base text-muted-foreground">({count})</span></h2>
      <ul className="mt-4 space-y-3">
        {people?.map((u) => (
          <li key={u.id} className="flex items-center gap-3">
            <Link href={`/u/${u.username}`}><UserAvatar user={u} /></Link>
            <div className="min-w-0 flex-1">
              <Link href={`/u/${u.username}`} className="block truncate text-sm font-semibold hover:underline">{u.displayName}</Link>
              <p className="text-[11px] text-muted-foreground">{t(`rankings.accountType.${u.accountType}`)}</p>
            </div>
            <FollowButton username={u.username} size="sm" />
          </li>
        ))}
      </ul>
      {people?.length === 0 && <p className="mt-3 text-sm text-muted-foreground">{t('follow.emptyList')}</p>}
    </section>
  );
}
