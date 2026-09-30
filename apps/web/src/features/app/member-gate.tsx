'use client';

import { useTranslations } from 'next-intl';
import { useApp } from './app-provider';

/** Chỉ render nội dung khi đã đăng nhập; khách thấy lời mời + nút đăng nhập (trang cá nhân/quản trị). */
export function MemberGate({ message, children }: { message: string; children: React.ReactNode }) {
  const t = useTranslations('nav');
  const { authReady, signedIn, openAuth } = useApp();
  if (!authReady) return <p className="text-sm text-muted-foreground">…</p>;
  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">{message}</p>
        <button onClick={openAuth} className="mt-3 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{t('signIn')}</button>
      </div>
    );
  }
  return <>{children}</>;
}
