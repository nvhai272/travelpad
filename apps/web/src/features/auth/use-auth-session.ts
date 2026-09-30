'use client';

import { useCallback, useEffect, useState } from 'react';
import type { UserProfile } from '@travelpad/contracts';
import { browserApi, setAccessToken } from '@/lib/browser-api';

/**
 * Phiên đăng nhập web (BR-AUTH-03): access token trong bộ nhớ, refresh token ở cookie httpOnly.
 * Khi mở trang: đổi cookie lấy access token mới để khôi phục phiên.
 */
export function useAuthSession(onSignedIn: () => void) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const loadMe = useCallback(async (token: string) => {
    setAccessToken(token);
    setUser(await browserApi.users.me());
  }, []);

  useEffect(() => {
    browserApi.auth.refresh()
      .then((t) => loadMe(t.accessToken))
      .catch(() => setAccessToken(null))
      .finally(() => setAuthReady(true));
  }, [loadMe]);

  const afterAuth = async (token: string) => {
    await loadMe(token);
    onSignedIn();
  };

  return {
    user, authReady,
    signIn: async (email: string, password: string) => afterAuth((await browserApi.auth.login({ email, password })).accessToken),
    signUp: async (email: string, password: string, displayName: string) =>
      afterAuth((await browserApi.auth.register({ email, password, displayName })).accessToken),
    signOut: async () => {
      await browserApi.auth.logout().catch(() => undefined);
      setAccessToken(null);
      setUser(null);
    },
  };
}
