'use client';

import { useTranslations } from 'next-intl';
import { MemberGate } from '@/features/app/member-gate';
import { FollowingFeed } from './following-feed';
import { FollowingList } from './following-list';

/** Trang Theo dõi: danh sách người đang theo dõi (trái) + câu chuyện mới của họ, phân trang (phải). */
export function FollowingPage() {
  const t = useTranslations();
  return (
    <MemberGate message={t('follow.loginRequired')}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-4"><FollowingList /></div>
        <section className="lg:col-span-8">
          <h2 className="mb-4 font-display text-2xl font-medium">{t('stories.followingTitle')}</h2>
          <FollowingFeed pageSize={6} paged columns="lg:grid-cols-2" />
        </section>
      </div>
    </MemberGate>
  );
}
