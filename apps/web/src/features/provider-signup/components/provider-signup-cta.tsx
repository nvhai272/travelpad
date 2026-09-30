import { getTranslations } from 'next-intl/server';
import { Store } from 'lucide-react';
import { Link } from '@/i18n/routing';

/** Thẻ mời nhà cung cấp đăng ký – đặt trên trang Kết nối du lịch. */
export async function ProviderSignupCta() {
  const t = await getTranslations('providerSignup');
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Store className="size-5" /></span>
      <div className="flex-1">
        <p className="font-display text-xl font-medium">{t('ctaTitle')}</p>
        <p className="text-sm text-muted-foreground">{t('ctaLead')}</p>
      </div>
      <Link href="/connect/register" className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground">{t('cta')}</Link>
    </section>
  );
}
