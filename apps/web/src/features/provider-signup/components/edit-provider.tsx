'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { MyProviderDetail, PlaceSummary } from '@travelpad/contracts';
import { useRouter } from '@/i18n/routing';
import { browserApi } from '@/lib/browser-api';
import { useApp } from '@/features/app/app-provider';
import { MemberGate } from '@/features/app/member-gate';
import { ProviderForm } from './provider-form';

/** Sửa hồ sơ đang chờ / bị từ chối rồi gửi duyệt lại. */
export function EditProvider({ id, destinations }: { id: string; destinations: PlaceSummary[] }) {
  const t = useTranslations('myProviders');
  const router = useRouter();
  const { signedIn } = useApp();
  const [detail, setDetail] = useState<MyProviderDetail | null>(null);

  useEffect(() => {
    if (signedIn) browserApi.myProviders.detail(id).then(setDetail).catch(() => setDetail(null));
  }, [signedIn, id]);

  return (
    <MemberGate message={t('loginRequired')}>
      {detail && (
        <ProviderForm destinations={destinations} initial={detail} onSave={async (input) => {
          await browserApi.myProviders.resubmit(id, input);
          router.push('/me/providers?submitted=1');
        }} />
      )}
    </MemberGate>
  );
}
