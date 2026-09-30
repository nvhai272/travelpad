import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MapPinned } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { serverApi, safe } from '@/lib/api';
import { CommunityPostCard } from '@/features/posts/components/community-post-card';
import { CommunityTabs } from '@/features/community/community-tabs';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'nav' });
  return { title: t('posts'), alternates: { canonical: '/posts' } };
}

/** Cộng đồng › Bài viết: danh sách bài chia sẻ + kết quả tìm bài viết (BR-SRCH-01). */
export default async function PostsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { q } = await searchParams;
  const posts = await safe(serverApi.posts.feed({ q, limit: 30 }), { items: [], nextCursor: null });

  return (
    <div className="mx-auto max-w-3xl">
      <CommunityTabs active="/posts" />
      <p className="eyebrow">{t('nav.community')}</p>
      <h1 className="font-display text-3xl font-medium sm:text-4xl">{q ? `“${q}”` : t('posts.title')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('posts.count', { count: posts.items.length })}</p>
      <div className="mt-6 space-y-4">
        {posts.items.map((p) => <CommunityPostCard key={p.id} post={p} />)}
      </div>
      {posts.items.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          {t('search.noPosts', { q: q ?? '' })}
        </div>
      )}
      {q && (
        <Link href={`/map?q=${encodeURIComponent(q)}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <MapPinned className="size-4" /> {t('search.onMap', { q })}
        </Link>
      )}
      {/* TODO(TL-204): phân trang vô hạn bằng nextCursor */}
    </div>
  );
}
