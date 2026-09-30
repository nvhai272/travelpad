'use client';

import { useFormatter, useNow } from 'next-intl';

/** "2 giờ trước" – tự cập nhật mỗi phút (phải là client component). */
export function RelativeTime({ date }: { date: string }) {
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });
  return <time dateTime={date}>{format.relativeTime(new Date(date), now)}</time>;
}
