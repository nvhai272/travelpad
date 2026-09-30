'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PagedResult, Story } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { Pagination } from '@/components/ui/pagination';
import { browserApi } from '@/lib/browser-api';
import { useFollowing } from '../following-provider';
import { StoryCard } from '@/features/stories/components/story-card';
import { ScrollRow } from '@/components/ui/scroll-row';

/** Câu chuyện từ người tôi theo dõi (mới → cũ). `paged=false`: bản rút gọn cho trang chủ. */
export function FollowingFeed({ pageSize, paged, columns = 'lg:grid-cols-3' }: { pageSize: number; paged: boolean; columns?: string }) {
  const t = useTranslations();
  const { count } = useFollowing();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PagedResult<Story> | null>(null);

  useEffect(() => {
    browserApi.stories.list({ following: true, page, pageSize }).then(setData).catch(() => setData(null));
  }, [page, pageSize, count]);

  if (data && data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        {t('stories.followingEmpty')} <Link href="/stories" className="font-semibold text-primary">{t('follow.findPeople')}</Link>
      </div>
    );
  }
  return (
    <>
      {/* Bản rút gọn (trang chủ): vuốt ngang trên điện thoại; bản có phân trang: lưới */}
      {paged ? (
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${columns}`}>{data?.items.map((s) => <StoryCard key={s.id} story={s} />)}</div>
      ) : (
        <ScrollRow gridClass={`sm:grid-cols-2 ${columns}`}>{data?.items.map((s) => <StoryCard key={s.id} story={s} />)}</ScrollRow>
      )}
      {paged && data && <Pagination page={data.page} totalPages={data.totalPages} onPage={setPage} />}
    </>
  );
}
