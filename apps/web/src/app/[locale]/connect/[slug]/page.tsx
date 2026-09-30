import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BadgeCheck, Languages, MapPin } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { serverApi, safe } from '@/lib/api';
import { PriceFrom } from '@/features/connect/components/provider-card';
import { ContactCard } from '@/features/connect/components/contact-card';
import { ProviderMobileCta } from '@/features/connect/components/provider-mobile-cta';
import { ConnectRequestForm } from '@/features/connect/components/connect-request-form';
import { EditorialHero } from '@/components/ui/editorial-hero';
import { StarVote } from '@/features/rating/components/star-vote';

type Props = { params: Promise<{ locale: string; slug: string }> };
const load = (slug: string) => safe(serverApi.providers.bySlug(slug), null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).slug);
  return p ? { title: `${p.name} – ${p.destination.name}`, description: p.description.slice(0, 160), alternates: { canonical: `/connect/${p.slug}` } } : {};
}

export default async function ProviderPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('connect');
  const p = await load(slug);
  if (!p) notFound();

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <article className="space-y-5 lg:col-span-8">
        <EditorialHero image={p.coverUrl} imageAlt={p.name} title={p.name} className="min-h-[300px] sm:min-h-[360px]"
          eyebrow={<><Link href={`/connect?destination=${p.destination.slug}`} className="hover:underline">{p.destination.name}</Link> · {t(`type.${p.type}`)}</>}>
          {p.verified && (
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground [text-shadow:none]">
              <BadgeCheck className="size-3.5" /> {t('verified')}
            </span>
          )}
        </EditorialHero>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
          <h2 className="font-display text-2xl font-medium">{t('about')}</h2>
          <p className="mt-2 text-sm leading-6">{p.description}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> {p.address ?? `${p.destination.name}, ${p.destination.province}`}</div>
            {p.languages.length > 0 && (
              <div className="flex items-center gap-2"><Languages className="size-4 text-primary" /> {t('languages', { list: p.languages.join(', ').toUpperCase() })}</div>
            )}
            <div className="text-base font-semibold"><PriceFrom p={p} /></div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">{t('note')}</p>
        </section>
      </article>
      <aside className="space-y-5 lg:col-span-4">
        {/* Đánh giá của cộng đồng trước, rồi mới tới liên hệ – người xem cần tin trước khi liên hệ.
            BR-CONN-07: chỉ người đã gửi yêu cầu kết nối mới chấm sao được – API trả lỗi rõ ràng nếu chưa */}
        <StarVote kind="provider" targetId={p.id}
          initial={{ ratingAvg: p.ratingAvg, reviewCount: p.reviewCount, ratingDistribution: p.ratingDistribution }} />
        <ContactCard providerId={p.id} maskedPhone={p.maskedPhone} />
        <ConnectRequestForm providerId={p.id} />
      </aside>
      <ProviderMobileCta p={p} />
    </div>
  );
}
