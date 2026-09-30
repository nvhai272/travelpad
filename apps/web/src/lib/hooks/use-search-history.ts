'use client';

import { useEffect, useState } from 'react';
import { SEARCH_HISTORY_LIMIT } from '@travelpad/contracts';

/** Lịch sử tìm kiếm lưu trên trình duyệt (BR-SRCH-04): tối đa 8 mục, bỏ trùng, mục mới lên đầu. */
export function useSearchHistory(storageKey: string) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(storageKey) ?? '[]')); } catch {}
  }, [storageKey]);

  const save = (list: string[]) => {
    setHistory(list);
    try { localStorage.setItem(storageKey, JSON.stringify(list)); } catch {}
  };

  return {
    history,
    remember: (term: string) => {
      const v = term.trim();
      if (v) save([v, ...history.filter((h) => h !== v)].slice(0, SEARCH_HISTORY_LIMIT));
    },
    remove: (term: string) => save(history.filter((h) => h !== term)),
    clear: () => save([]),
  };
}
