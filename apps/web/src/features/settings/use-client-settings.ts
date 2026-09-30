'use client';

import { useCallback, useEffect, useState } from 'react';

export type ClientSettings = {
  theme: 'light' | 'dark' | 'system';
  mapStyle: 'classic' | 'terrain' | 'satellite';
  largeText: boolean;
  dataSaver: boolean;
  notifyFollowing: boolean;
  notifyHot: boolean;
  notifyComments: boolean;
  shareLocation: boolean;
};

const DEFAULT_SETTINGS: ClientSettings = {
  theme: 'light', mapStyle: 'classic', largeText: false, dataSaver: false,
  notifyFollowing: true, notifyHot: true, notifyComments: false, shareLocation: true,
};
const STORAGE_KEY = 'travelpad.settings';

/** Cài đặt phía trình duyệt (BR-SET-01..03): lưu localStorage, áp dụng chế độ màu & cỡ chữ lên <html>. */
export function useClientSettings() {
  const [settings, setSettings] = useState<ClientSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    root.dataset.largeText = String(settings.largeText);
  }, [settings.theme, settings.largeText]);

  const updateSettings = useCallback((patch: Partial<ClientSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // TODO(TL-105): thành viên đồng bộ PATCH /me/settings
  return { settings, updateSettings };
}
