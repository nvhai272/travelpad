import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PHOTO_CREDITS } from '@/lib/photo-credits';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'credits' });
  return { title: t('title'), description: t('lead'), alternates: { canonical: '/credits' } };
}

/** Nguồn ảnh: ghi công đầy đủ tác giả + giấy phép cho mọi ảnh Wikimedia Commons đang dùng. */
export default async function CreditsPage({ params }: Props) {
  setRequestLocale((await params).locale);
  const t = await getTranslations('credits');
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-medium sm:text-5xl">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t('lead')}</p>
      <p className="mt-1 max-w-2xl text-xs text-muted-foreground">{t('note')}</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(PHOTO_CREDITS).map(([src, c]) => (
          <li key={src} className="overflow-hidden rounded-xl border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div className="space-y-0.5 p-2.5 text-xs">
              <p className="truncate font-semibold">{c.artist}</p>
              <p className="text-muted-foreground">{c.license}</p>
              <a href={c.source} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">{t('view')} ↗</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
