import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MyProviderList } from '@/features/provider-signup/components/my-provider-list';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ submitted?: string }> };

export const metadata: Metadata = { robots: { index: false } };

/** Dịch vụ của tôi – trang cá nhân, không index. */
export default async function MyProvidersPage({ params, searchParams }: Props) {
  setRequestLocale((await params).locale);
  const t = await getTranslations('myProviders');
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-medium sm:text-4xl">{t('title')}</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">{t('lead')}</p>
      <MyProviderList justSubmitted={(await searchParams).submitted === '1'} />
    </div>
  );
}
