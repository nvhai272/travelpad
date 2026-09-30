'use client';

import { useState } from 'react';
import { useApp } from '@/features/app/app-provider';
import { browserApi } from '@/lib/browser-api';
import { useFollowing } from '../following-provider';

/** Theo dõi / bỏ theo dõi – cập nhật lạc quan vào kho chung, lỗi thì hoàn tác; khách → mời đăng nhập (BR-FOL-01). */
export function useFollow(username: string) {
  const { requireAuth } = useApp();
  const { isFollowing, setFollowing } = useFollowing();
  const [busy, setBusy] = useState(false);
  const following = isFollowing(username);

  const toggle = () => requireAuth(async () => {
    const next = !isFollowing(username);
    setFollowing(username, next);
    setBusy(true);
    try {
      await (next ? browserApi.follows.follow(username) : browserApi.follows.unfollow(username));
    } catch {
      setFollowing(username, !next);
    } finally {
      setBusy(false);
    }
  });

  return { following, busy, toggle };
}
