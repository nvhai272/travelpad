import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

/** Tiêu đề mục trang: eyebrow + tiêu đề serif + mô tả + liên kết "Xem tất cả". */
export function SectionHead({ eyebrow, title, sub, href, cta }: { eyebrow: string; title: string; sub?: string; href?: string; cta?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display text-2xl font-medium sm:text-3xl">{title}</h2>
        {sub && <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">{sub}</p>}
      </div>
      {href && cta && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
          {cta} <ChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
