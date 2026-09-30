'use client';

import { useEffect, useState } from 'react';
import { browserApi } from '@/lib/browser-api';

/** Id các điểm đến thành viên đã check-in (tab "Của tôi" – BR-MAP-02). Khách: rỗng. */
export function useFootprints(signedIn: boolean) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    if (!signedIn) { setIds([]); return; }
    browserApi.users.footprints().then((fp) => setIds(fp.map((x) => x.placeId))).catch(() => setIds([]));
  }, [signedIn]);
  return ids;
}
