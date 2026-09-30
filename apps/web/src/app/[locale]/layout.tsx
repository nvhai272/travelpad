import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Be_Vietnam_Pro, Dancing_Script, Lora } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SideDecor } from '@/components/decor/side-decor';
import { AppProvider } from '@/features/app/app-provider';
import { FollowingProvider } from '@/features/follow/following-provider';
import { AuthDialog } from '@/features/auth/auth-dialog';
import { SettingsSheet } from '@/features/settings/settings-sheet';
import '../globals.css';

/** Nội dung: Be Vietnam Pro – font do người Việt thiết kế, dấu tiếng Việt vẽ riêng. Tiêu đề: Lora – serif giữ chất tạp chí, dấu tiếng Việt rõ. */
const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], variable: '--font-be-vietnam', display: 'swap',
});
const lora = Lora({ subsets: ['latin', 'vietnamese'], weight: ['500', '600', '700'], variable: '--font-lora', display: 'swap' });
/** Chữ nghệ thuật "Việt Nam" trong logo: nét viết tay kiểu thư pháp, có dấu tiếng Việt. */
const script = Dancing_Script({ subsets: ['latin', 'vietnamese'], weight: ['700'], variable: '--font-dancing', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} – Sổ tay du lịch cộng đồng`, template: `%s · ${SITE_NAME}` },
  description: 'Tìm hiểu văn hóa Việt, khám phá điểm đến được cộng đồng chấm sao, lên lịch trình có gợi ý và chọn dịch vụ du lịch uy tín.',
  openGraph: { siteName: SITE_NAME, type: 'website' },
};

/** viewport-fit=cover để dùng vùng an toàn (tai thỏ, thanh home) của iPhone; màu thanh trình duyệt khớp nền. */
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#F8F3EB' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} data-theme="light" className={`${beVietnam.variable} ${lora.variable} ${script.variable}`}>
      <body className="min-h-dvh overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider>
          <AppProvider>
            <FollowingProvider>
              <SiteHeader />
              <SideDecor />
              <main className="mx-auto max-w-[1480px] px-4 pb-6 pt-4 sm:px-6 lg:px-10 lg:py-7">{children}</main>
              <SiteFooter />
              <MobileNav />
              <AuthDialog />
              <SettingsSheet />
            </FollowingProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
