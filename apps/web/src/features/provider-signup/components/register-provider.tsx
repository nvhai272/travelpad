'use client';

import { useTranslations } from 'next-intl';
import type { PlaceSummary } from '@travelpad/contracts';
import { useRouter } from '@/i18n/routing';
import { browserApi } from '@/lib/browser-api';
import { MemberGate } from '@/features/app/member-gate';
import { ProviderForm } from './provider-form';

/** Đăng ký mới: cần đăng nhập; gửi xong chuyển sang "Dịch vụ của tôi". */
export function RegisterProvider({ destinations }: { destinations: PlaceSummary[] }) {
  const t = useTranslations('myProviders');
  const router = useRouter();
  return (
    <MemberGate message={t('loginRequired')}>
      <ProviderForm destinations={destinations} onSave={async (input) => {
        await browserApi.myProviders.register(input);
        router.push('/me/providers?submitted=1');
      }} />
    </MemberGate>
  );
}
