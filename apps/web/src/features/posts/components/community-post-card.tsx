'use client';

import { useFormatter, useNow, useTranslations } from 'next-intl';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import type { PostSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { usePostReactions } from '../hooks/use-post-reactions';

/** Bài chia sẻ ngắn của cộng đồng – thích/lưu optimistic, khách bấm thì mời đăng nhập. */
export function CommunityPostCard({ post }: { post: PostSummary }) {
  const t = useTranslations('post');
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });
  const { liked, saved, likes, toggleLike, toggleSave } = usePostReactions(post);

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <div className="flex items-center gap-3">
        {post.author.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.author.avatarUrl} alt={post.author.displayName} loading="lazy" className="size-11 rounded-full object-cover" />
        ) : (
          <span className="grid size-11 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{post.author.displayName[0]}</span>
        )}
        <div>
          <Link href={`/u/${post.author.username}`} className="text-sm font-semibold hover:underline">{post.author.displayName}</Link>
          <p className="text-xs text-muted-foreground">
            {format.relativeTime(new Date(post.publishedAt), now)}{post.place && ` · ${post.place.name}`}
          </p>
        </div>
        <button onClick={toggleSave} aria-label={saved ? t('saved') : t('save')} className={`ml-auto ${saved ? 'text-accent' : 'text-muted-foreground'}`}>
          <Bookmark className={`size-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <Link href={`/posts/${post.slug}`} className="mt-4 block text-sm leading-6 hover:text-primary">{post.excerpt}</Link>
      <div className="mt-4 flex items-center gap-5 border-t border-border pt-4 text-xs text-muted-foreground">
        <button onClick={toggleLike} aria-pressed={liked} className={`flex items-center gap-1.5 ${liked ? 'text-accent' : ''}`}>
          <Heart className={`size-4 ${liked ? 'fill-current' : ''}`} /> {likes}
        </button>
        <Link href={`/posts/${post.slug}#comments`} className="flex items-center gap-1.5">
          <MessageCircle className="size-4" /> {t('comments', { count: post.commentCount })}
        </Link>
      </div>
    </article>
  );
}
