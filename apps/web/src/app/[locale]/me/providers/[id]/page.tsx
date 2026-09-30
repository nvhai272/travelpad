import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { EditProvider } from '@/features/provider-signup/components/edit-provider';
import { loadDestinations } from '@/features/provider-signup/load-destinations';

type Props = { params: Promise<{ locale: string; id: string }> };

export const metadata: Metadata = { robots: { index: false } };

/** Sửa hồ sơ dịch vụ đang chờ / bị từ chối rồi gửi lại. */
export default async function EditProviderPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('myProviders');
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-4xl font-medium">{t('editTitle')}</h1>
      <EditProvider id={id} destinations={await loadDestinations()} />
    </div>
  );
}
