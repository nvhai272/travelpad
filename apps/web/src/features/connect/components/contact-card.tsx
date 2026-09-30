'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Globe, Lock, MessageCircle, Phone } from 'lucide-react';
import type { ProviderContact } from '@travelpad/contracts';
import { useApp } from '@/features/app/app-provider';
import { browserApi } from '@/lib/browser-api';

/** BR-CONN-03: khách thấy số đã che + mời đăng nhập; thành viên xem đầy đủ, bấm gọi/mở Zalo. */
export function ContactCard({ providerId, maskedPhone }: { providerId: string; maskedPhone: string }) {
  const t = useTranslations('connect');
  const { signedIn, requireAuth } = useApp();
  const [contact, setContact] = useState<ProviderContact | null>(null);
  const reveal = () => requireAuth(() => { browserApi.providers.contact(providerId).then(setContact).catch(() => undefined); });

  return (
    <section id="contact" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <h2 className="font-display text-2xl font-medium">{t('contact')}</h2>
      {contact ? (
        <ul className="mt-3 space-y-2 text-sm">
          <li><a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 font-semibold text-primary"><Phone className="size-4" /> {contact.phone}</a></li>
          {contact.zalo && (
            <li><a href={`https://zalo.me/${contact.zalo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"><MessageCircle className="size-4 text-primary" /> {t('zalo')}: {contact.zalo}</a></li>
          )}
          {contact.website && (
            <li><a href={contact.website} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2"><Globe className="size-4 text-primary" /> {contact.website}</a></li>
          )}
        </ul>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-4" /> {maskedPhone}</span>
          <button onClick={reveal} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">{t('showContact')}</button>
        </div>
      )}
      {!signedIn && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3.5" /> {t('loginToContact')}</p>}
    </section>
  );
}
