import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FollowingPage } from '@/features/follow/components/following-page';
import { CommunityTabs } from '@/features/community/community-tabs';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = { robots: { index: false } };

/** Trang Theo dõi (thay cho Bạn bè – BR-FOL-02). */
export default async function Following({ params }: Props) {
  setRequestLocale((await params).locale);
  const t = await getTranslations('follow');
  return (
    <>
      <CommunityTabs active="/following" />
      <h1 className="font-display text-3xl font-medium sm:text-4xl">{t('title')}</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">{t('lead')}</p>
      <FollowingPage />
    </>
  );
}
