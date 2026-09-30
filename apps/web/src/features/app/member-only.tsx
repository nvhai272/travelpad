'use client';

import { useApp } from './app-provider';

/** Chỉ render cho thành viên (ẩn hẳn với khách, không hiện thẻ khoá) – BR-HOME-03. */
export function MemberOnly({ children }: { children: React.ReactNode }) {
  const { signedIn, authReady } = useApp();
  return authReady && signedIn ? <>{children}</> : null;
}
