'use client';

import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useApp } from '@/features/app/app-provider';

/** Thẻ khoá cho khách: giải thích lợi ích + CTA đăng nhập ngay tại chỗ. */
export function LockedCard({ body }: { body: string }) {
  const t = useTranslations();
  const { openAuth } = useApp();
  return (
    <div className="mt-4 rounded-xl border border-dashed border-border bg-background/60 p-4 text-center">
      <span className="mx-auto mb-2 grid size-9 place-items-center rounded-full bg-secondary"><Lock className="size-4 text-primary" /></span>
      <p className="text-sm font-semibold">{t('locked.title')}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
      <button onClick={openAuth} className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">{t('nav.signIn')}</button>
    </div>
  );
}
