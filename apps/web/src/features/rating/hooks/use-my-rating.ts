'use client';

import { useEffect, useState } from 'react';
import { ApiClientError } from '@travelpad/api-client';
import type { MyRating } from '@travelpad/contracts';
import { useApp } from '@/features/app/app-provider';
import { browserApi } from '@/lib/browser-api';

export type RatingKind = 'place' | 'provider';
export type RatingSummaryData = Pick<MyRating, 'ratingAvg' | 'reviewCount' | 'ratingDistribution'>;

/**
 * Vote sao "của tôi" cho địa điểm (BR-REV-01..03) hoặc nhà cung cấp (BR-CONN-07).
 * Giữ điểm cộng đồng mới nhất sau mỗi thao tác (không chờ cache server).
 */
export function useMyRating(kind: RatingKind, targetId: string, initial: RatingSummaryData) {
  const api = kind === 'place' ? browserApi.places : browserApi.providers;
  const { signedIn, requireAuth } = useApp();
  const [summary, setSummary] = useState(initial);
  const [mine, setMine] = useState<MyRating['myReview']>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signedIn) { setMine(null); return; }
    api.myRating(targetId).then((r) => setMine(r.myReview)).catch(() => undefined);
  }, [signedIn, targetId]); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = (r: MyRating, next: typeof status) => { setSummary(r); setMine(r.myReview); setStatus(next); };

  return {
    summary, mine, status, error,
    /** Khách → mở hộp đăng nhập, đăng nhập xong tự gửi vote. */
    rate: (rating: number, content?: string) => requireAuth(async () => {
      setStatus('saving');
      setError(null);
      try {
        apply(await api.rate(targetId, { rating, content: content?.trim() || undefined }), 'saved');
      } catch (e) {
        setStatus('idle');
        setError(e instanceof ApiClientError ? e.error.message : 'Error');
      }
    }),
    remove: async () => apply(await api.removeRating(targetId), 'idle'),
    markDirty: () => setStatus('idle'),
  };
}
