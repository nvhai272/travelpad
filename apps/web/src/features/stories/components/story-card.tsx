import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import type { Story } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RelativeTime } from '@/components/ui/relative-time';
import { UserAvatar } from '@/features/rankings/components/ranking-parts';
import { FollowButton } from '@/features/follow/components/follow-button';

/** Thẻ câu chuyện: ảnh địa điểm, số sao, trích đoạn nhận xét, tác giả + loại tài khoản + nút theo dõi (BR-STORY-02). */
export function StoryCard({ story: s, showFollow = true }: { story: Story; showFollow?: boolean }) {
  const t = useTranslations();
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-editorial">
      <Link href={`/places/${s.place.slug}`} className="group relative block h-28 overflow-hidden bg-secondary">
        {s.place.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.place.coverUrl} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-3 bottom-2 flex items-end justify-between text-white">
          <span className="truncate font-display text-lg font-medium">{s.place.name}</span>
          <span className="flex shrink-0 items-center gap-0.5" aria-label={`${s.rating}/5`}>
            {Array.from({ length: s.rating }, (_, i) => <Star key={i} className="size-3 fill-current text-amber-300" />)}
          </span>
        </div>
      </Link>
      <blockquote className="flex-1 p-4 font-display text-lg leading-snug">
        “{s.content.length > 180 ? `${s.content.slice(0, 177)}…` : s.content}”
      </blockquote>
      <footer className="flex items-center gap-2 border-t border-border px-4 py-3">
        <Link href={`/u/${s.author.username}`} className="shrink-0"><UserAvatar user={s.author} size={32} /></Link>
        <div className="min-w-0 flex-1">
          <Link href={`/u/${s.author.username}`} className="block truncate text-sm font-semibold hover:underline">{s.author.displayName}</Link>
          <p className="truncate text-[11px] text-muted-foreground">
            {t(`rankings.accountType.${s.author.accountType}`)} · <RelativeTime date={s.createdAt} />
          </p>
        </div>
        {showFollow && <FollowButton username={s.author.username} size="sm" />}
      </footer>
    </article>
  );
}
