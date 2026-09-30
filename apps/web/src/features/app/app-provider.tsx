'use client';

import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { UserProfile } from '@travelpad/contracts';
import { useAuthSession } from '@/features/auth/use-auth-session';
import { useClientSettings, type ClientSettings } from '@/features/settings/use-client-settings';

export type { ClientSettings };

type AppState = {
  settings: ClientSettings;
  updateSettings: (patch: Partial<ClientSettings>) => void;
  user: UserProfile | null;
  signedIn: boolean;
  authReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  /** Khách bấm tính năng cá nhân → mở hộp đăng nhập, đăng nhập xong chạy tiếp hành động (BR-AUTH-06). */
  requireAuth: (action: () => void) => void;
};

const AppContext = createContext<AppState | null>(null);

/** Trạng thái toàn cục phía client: phiên đăng nhập, cài đặt, các hộp thoại. */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useClientSettings();
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pending = useRef<(() => void) | null>(null);

  const session = useAuthSession(() => {
    setAuthOpen(false);
    pending.current?.();
    pending.current = null;
  });

  const value = useMemo<AppState>(() => ({
    settings, updateSettings,
    ...session, signedIn: !!session.user,
    authOpen,
    openAuth: () => setAuthOpen(true),
    closeAuth: () => { setAuthOpen(false); pending.current = null; },
    settingsOpen, setSettingsOpen,
    requireAuth: (action) => {
      if (session.user) return action();
      pending.current = action;
      setAuthOpen(true);
    },
  }), [settings, updateSettings, session, authOpen, settingsOpen]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
