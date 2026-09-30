import { useTranslations } from 'next-intl';
import { creditFor } from '@/lib/photo-credits';

/** Dòng ghi công nhỏ trên ảnh lớn (bắt buộc với giấy phép CC BY / CC BY-SA). Không có ghi công thì không hiện. */
export function PhotoCredit({ src, className = '' }: { src?: string | null; className?: string }) {
  const t = useTranslations('common');
  const c = creditFor(src);
  if (!c) return null;
  return (
    <a href={c.source} target="_blank" rel="noopener noreferrer license"
      className={`rounded bg-black/35 px-1.5 py-0.5 text-[10px] text-white/80 backdrop-blur-sm hover:text-white ${className}`}>
      {t('photoBy', { artist: c.artist, license: c.license })}
    </a>
  );
}
