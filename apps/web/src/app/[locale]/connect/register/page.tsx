import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RegisterProvider } from '@/features/provider-signup/components/register-provider';
import { loadDestinations } from '@/features/provider-signup/load-destinations';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'providerSignup' });
  return { title: t('title'), description: t('lead'), alternates: { canonical: '/connect/register' } };
}

/** Đăng ký nhà cung cấp dịch vụ (BR-CONN-06). */
export default async function RegisterProviderPage({ params }: Props) {
  setRequestLocale((await params).locale);
  const t = await getTranslations('providerSignup');
  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="font-display text-3xl font-medium sm:text-5xl">{t('title')}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('lead')}</p>
      <p className="mt-3 rounded-xl bg-secondary px-4 py-3 text-xs font-semibold">{t('steps')}</p>
      <div className="mt-6"><RegisterProvider destinations={await loadDestinations()} /></div>
    </div>
  );
}
