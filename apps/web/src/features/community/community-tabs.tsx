import { getTranslations } from 'next-intl/server';
import { PageTabs } from '@/components/ui/page-tabs';

/** Mục "Cộng đồng": câu chuyện (nhận xét kèm sao) · bài viết chia sẻ · người đang theo dõi. */
export async function CommunityTabs({ active }: { active: '/stories' | '/posts' | '/following' }) {
  const t = await getTranslations('nav');
  return (
    <PageTabs label={t('community')} active={active}
      tabs={[{ href: '/stories', label: t('stories') }, { href: '/posts', label: t('posts') }, { href: '/following', label: t('following') }]} />
  );
}
