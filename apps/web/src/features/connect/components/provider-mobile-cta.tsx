import { getTranslations } from 'next-intl/server';
import { Phone } from 'lucide-react';
import type { ProviderSummary } from '@travelpad/contracts';
import { PriceFrom } from './provider-card';

/**
 * Điện thoại: thanh hành động cố định ngay trên thanh tab – giá + nút Liên hệ (cuộn tới #contact).
 * Hành động quan trọng nhất của trang luôn trong tầm ngón cái.
 */
export async function ProviderMobileCta({ p }: { p: Pick<ProviderSummary, 'priceFrom' | 'priceUnit'> }) {
  const t = await getTranslations('connect');
  return (
    <>
      <div className="h-16 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 flex items-center gap-3 border-t border-border bg-card/95 px-4 py-2.5 backdrop-blur-xl lg:hidden">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold"><PriceFrom p={p} /></p>
        <a href="#contact" className="flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
          <Phone className="size-4" /> {t('contact')}
        </a>
      </div>
    </>
  );
}
