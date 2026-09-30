'use client';

import { useTranslations } from 'next-intl';
import { UserCheck, UserPlus } from 'lucide-react';
import { useApp } from '@/features/app/app-provider';
import { useFollow } from '../hooks/use-follow';

/** Nút Theo dõi – ẩn với chính mình. `size="sm"` cho thẻ câu chuyện. */
export function FollowButton({ username, size = 'md' }: { username: string; size?: 'sm' | 'md' }) {
  const t = useTranslations('follow');
  const { user } = useApp();
  const { following, busy, toggle } = useFollow(username);
  if (user?.username === username) return null;

  const base = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-4 py-2 text-sm';
  // md (hồ sơ): nút chính màu đặc. sm (thẻ): hành động phụ – viền nhẹ, không tranh chú ý với nội dung
  const tone = following
    ? 'border border-border bg-card text-muted-foreground hover:border-destructive hover:text-destructive'
    : size === 'sm' ? 'border border-primary/40 text-primary hover:bg-primary/5' : 'bg-primary text-primary-foreground';
  return (
    <button type="button" onClick={toggle} disabled={busy} aria-pressed={following} title={following ? t('unfollow') : undefined}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-semibold transition disabled:opacity-60 ${base} ${tone}`}>
      {following ? <UserCheck className="size-3.5" /> : <UserPlus className="size-3.5" />}
      {following ? t('following') : t('follow')}
    </button>
  );
}
