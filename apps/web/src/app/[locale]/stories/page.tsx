import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { STORIES_PAGE_SIZE, type PagedResult, type Story } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';
import { Pagination } from '@/components/ui/pagination';
import { StoryCard } from '@/features/stories/components/story-card';
import { CommunityTabs } from '@/features/community/community-tabs';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'stories' });
  const page = Number((await searchParams).page ?? 1);
  return { title: t('pageTitle'), description: t('pageLead'), alternates: { canonical: page > 1 ? `/stories?page=${page}` : '/stories' } };
}

/** Tất cả câu chuyện (đánh giá của người dùng), mới → cũ, phân trang theo số trang – render server để SEO (BR-STORY-03). */
export default async function StoriesPage({ params, searchParams }: Props) {
  setRequestLocale((await params).locale);
  const t = await getTranslations('stories');
  const page = Math.max(1, Number((await searchParams).page ?? 1) || 1);
  const empty: PagedResult<Story> = { items: [], page, pageSize: STORIES_PAGE_SIZE, total: 0, totalPages: 1 };
  const data = await safe(serverApi.stories.list({ page, pageSize: STORIES_PAGE_SIZE }), empty);

  return (
    <>
      <CommunityTabs active="/stories" />
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="font-display text-3xl font-medium sm:text-5xl">{t('pageTitle')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('pageLead')} · {t('count', { count: data.total })}</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((s) => <StoryCard key={s.id} story={s} />)}
      </div>
      {data.items.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t('empty')}</p>}
      <Pagination page={data.page} totalPages={data.totalPages} basePath="/stories" />
    </>
  );
}
