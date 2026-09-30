'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = { initial: string; saving: boolean; onSubmit: (content: string) => void; onRemove: () => void; onEdit: () => void };

/** Nhận xét kèm vote (không bắt buộc, từ 10 ký tự) + xoá vote của tôi. */
export function ReviewCommentForm({ initial, saving, onSubmit, onRemove, onEdit }: Props) {
  const t = useTranslations('rating');
  const [comment, setComment] = useState(initial);
  useEffect(() => setComment(initial), [initial]);
  return (
    <div className="mt-3 space-y-2">
      <textarea value={comment} onChange={(e) => { setComment(e.target.value); onEdit(); }} rows={3} maxLength={2000} placeholder={t('comment')}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
      <div className="flex items-center justify-between">
        <button onClick={onRemove} className="text-xs font-semibold text-muted-foreground hover:text-destructive">{t('remove')}</button>
        <button onClick={() => onSubmit(comment)} disabled={saving}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">{t('update')}</button>
      </div>
    </div>
  );
}
