'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useApp } from '@/features/app/app-provider';
import { browserApi } from '@/lib/browser-api';

type FollowingState = { isFollowing: (username: string) => boolean; setFollowing: (username: string, on: boolean) => void; count: number };

const FollowingContext = createContext<FollowingState | null>(null);

/** Danh sách người tôi đang theo dõi – tải một lần khi đăng nhập, mọi nút Theo dõi đọc chung (đồng bộ trạng thái). */
export function FollowingProvider({ children }: { children: React.ReactNode }) {
  const { signedIn } = useApp();
  const [usernames, setUsernames] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!signedIn) { setUsernames(new Set()); return; }
    browserApi.follows.following().then((r) => setUsernames(new Set(r.items.map((u) => u.username)))).catch(() => undefined);
  }, [signedIn]);

  const setFollowing = useCallback((username: string, on: boolean) => {
    setUsernames((cur) => {
      const next = new Set(cur);
      if (on) next.add(username); else next.delete(username);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ isFollowing: (u: string) => usernames.has(u), setFollowing, count: usernames.size }), [usernames, setFollowing]);
  return <FollowingContext.Provider value={value}>{children}</FollowingContext.Provider>;
}

export function useFollowing() {
  const ctx = useContext(FollowingContext);
  if (!ctx) throw new Error('useFollowing must be used inside FollowingProvider');
  return ctx;
}
