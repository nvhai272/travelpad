import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProviderQueue } from '@/features/admin/components/provider-queue';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = { robots: { index: false } };

/** Quản trị: duyệt hồ sơ nhà cung cấp (BR-CONN-05/06). Quyền được API kiểm tra (@Roles). */
export default async function AdminProvidersPage({ params }: Props) {
  setRequestLocale((await params).locale);
  const t = await getTranslations('admin');
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-medium sm:text-4xl">{t('title')}</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">{t('lead')}</p>
      <ProviderQueue />
    </div>
  );
}
