'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import { ApiClientError } from '@travelpad/api-client';
import { useApp } from '@/features/app/app-provider';
import { browserApi } from '@/lib/browser-api';

const input = 'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20';

/** BR-CONN-04: gửi yêu cầu kết nối (lời nhắn, ngày đi, số người, SĐT tuỳ chọn). Khách → mời đăng nhập. */
export function ConnectRequestForm({ providerId }: { providerId: string }) {
  const t = useTranslations('connect');
  const { requireAuth } = useApp();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function send(form: HTMLFormElement) {
    const f = new FormData(form);
    setStatus('sending');
    setError(null);
    try {
      await browserApi.providers.requestConnect(providerId, {
        message: String(f.get('message')),
        travelDate: (f.get('travelDate') as string) || undefined,
        people: f.get('people') ? Number(f.get('people')) : undefined,
        contactPhone: (f.get('contactPhone') as string) || undefined,
      });
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      setError(err instanceof ApiClientError ? err.error.message : 'Error');
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <h2 className="font-display text-2xl font-medium">{t('requestTitle')}</h2>
      {status === 'sent' ? (
        <p className="mt-3 rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary">{t('sent')}</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); const form = e.currentTarget; requireAuth(() => void send(form)); }} className="mt-3 space-y-3">
          <textarea name="message" required minLength={10} maxLength={1000} rows={3} placeholder={t('message')} className={input} />
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-muted-foreground">{t('travelDate')}<input name="travelDate" type="date" className={`${input} mt-1`} /></label>
            <label className="text-xs font-semibold text-muted-foreground">{t('people')}<input name="people" type="number" min={1} max={50} className={`${input} mt-1`} /></label>
          </div>
          <input name="contactPhone" inputMode="tel" placeholder={t('yourPhone')} className={input} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={status === 'sending'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            <Send className="size-4" /> {t('send')}
          </button>
        </form>
      )}
    </section>
  );
}
