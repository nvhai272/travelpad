import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProviderGroupSchema, type PlaceSummary, type ProviderGroup } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { serverApi, safe } from '@/lib/api';
import { ProviderCard } from '@/features/connect/components/provider-card';
import { ConnectSearch } from '@/features/connect/components/connect-search';
import { ProviderSignupCta } from '@/features/provider-signup/components/provider-signup-cta';
import { Pagination } from '@/components/ui/pagination';
import { ExploreTabs } from '@/features/explore/explore-tabs';

type SP = { group?: string; destination?: string; q?: string; page?: string };
const PAGE_SIZE = 12;
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<SP> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'connect' });
  return { title: t('title'), description: t('lead'), alternates: { canonical: '/connect' } };
}

const href = (sp: SP) => {
  const p = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]);
  return `/connect${p.size ? `?${p}` : ''}`;
};

/** Dịch vụ du lịch: danh bạ lưu trú, ăn uống, di chuyển, hướng dẫn viên/tour theo điểm đến (§10b); mời nhà cung cấp đăng ký ngay đầu trang. */
export default async function ConnectPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('connect');
  const sp = await searchParams;
  const group = ProviderGroupSchema.safeParse(sp.group).data;
  const page = Math.max(1, Number(sp.page) || 1);

  const [providers, destinations] = await Promise.all([
    safe(serverApi.providers.list({ group, destination: sp.destination, q: sp.q }), { items: [] }),
    safe(serverApi.places.list({ kind: 'destination', sort: 'featured', limit: 50 }), { items: [] as PlaceSummary[], nextCursor: null }),
  ]);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-secondary'}`;

  return (
    <>
      <ExploreTabs active="/connect" />
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="font-display text-3xl font-medium sm:text-5xl">{t('title')}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t('lead')}</p>
      <div className="mt-4"><ProviderSignupCta /></div>

      <div className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-editorial">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-secondary p-1 text-xs font-semibold sm:inline-flex">
          {([undefined, ...ProviderGroupSchema.options] as (ProviderGroup | undefined)[]).map((g) => (
            <Link key={g ?? 'all'} href={href({ ...sp, group: g, page: undefined })}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-center transition ${group === g ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              {t(g ?? 'all')}
            </Link>
          ))}
        </div>
        <ConnectSearch params={{ group, destination: sp.destination }} />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href={href({ ...sp, destination: undefined, page: undefined })} className={chip(!sp.destination)}>{t('allDestinations')}</Link>
          {destinations.items.map((d) => (
            <Link key={d.id} href={href({ ...sp, destination: d.slug, page: undefined })} className={chip(sp.destination === d.slug)}>{d.name}</Link>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold">{t('results', { count: providers.items.length })}</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((p) => <ProviderCard key={p.id} p={p} />)}
      </div>
      <Pagination page={page} totalPages={Math.ceil(providers.items.length / PAGE_SIZE)} basePath={href({ ...sp, page: undefined })} />
      {providers.items.length === 0 && (
        <p className="mt-3 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t('empty')}</p>
      )}
      <p className="mt-6 text-xs text-muted-foreground">{t('note')}</p>
    </>
  );
}
