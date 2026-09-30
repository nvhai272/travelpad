import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

/** Huy hiệu hạng: top 1 nổi bật, top 2–3 nhấn nhẹ, còn lại trung tính. */
export function RankBadge({ rank }: { rank: number }) {
  const tone = rank === 1 ? 'bg-vn-red text-vn-gold' : rank <= 3 ? 'bg-accent/15 text-accent' : 'bg-secondary text-muted-foreground';
  return <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${tone}`}>{rank}</span>;
}

/** Tiêu đề thẻ BXH: eyebrow (tuỳ chọn) + tiêu đề serif + mô tả ngắn. */
export function RankingHeader({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub: string }) {
  return (
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="font-display text-xl font-medium">{title}</h2>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

export function Initials({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span style={{ width: size, height: size }} className="grid shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {name.split(' ').map((w) => w[0]).slice(-2).join('')}
    </span>
  );
}

export const rankingCardClass = 'flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-editorial';

/** Liên kết cuối thẻ BXH, luôn nằm đáy thẻ. */
export function RankingFooter({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
      {label} <ArrowRight className="size-4" />
    </Link>
  );
}

/** Ảnh đại diện người dùng, fallback chữ cái đầu. */
export function UserAvatar({ user, size = 40 }: { user: { displayName: string; avatarUrl: string | null }; size?: number }) {
  return user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatarUrl} alt="" loading="lazy" style={{ width: size, height: size }} className="rounded-full object-cover" />
  ) : (
    <Initials name={user.displayName} size={size} />
  );
}
