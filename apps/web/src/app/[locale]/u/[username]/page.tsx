import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HOME_STORIES_LIMIT } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';
import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/features/follow/components/follow-button';
import { StoryCard } from '@/features/stories/components/story-card';

type Props = { params: Promise<{ locale: string; username: string }> };
const load = (u: string) => safe(serverApi.users.byUsername(u), null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await load((await params).username);
  return user ? { title: `${user.displayName} (@${user.username})`, description: user.bio ?? undefined } : {};
}

/** Hồ sơ công khai: loại tài khoản, số liệu, nút Theo dõi, câu chuyện gần đây (BR-PROF-01, BR-FOL-01). */
export default async function ProfilePage({ params }: Props) {
  const { locale, username } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const user = await load(username);
  if (!user) notFound();
  const stories = await safe(serverApi.stories.list({ author: username, pageSize: HOME_STORIES_LIMIT }), null);
  const stats = [['reviews', user.stats.reviews], ['followers', user.stats.followers], ['followingStat', user.stats.following]] as const;

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-editorial">
        <Avatar user={user} size={80} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-medium sm:text-4xl">{user.displayName}</h1>
          <p className="text-sm text-muted-foreground">@{user.username} · {t(`rankings.accountType.${user.accountType}`)} · {t('profile.level', { level: user.level })}</p>
          {user.bio && <p className="mt-2 max-w-xl text-sm">{user.bio}</p>}
        </div>
        <dl className="flex gap-6 text-center">
          {stats.map(([k, v]) => (
            <div key={k}><dd className="font-display text-2xl font-semibold">{v}</dd><dt className="text-xs text-muted-foreground">{t(`profile.${k}`)}</dt></div>
          ))}
        </dl>
        <FollowButton username={user.username} />
      </section>
      <section>
        <h2 className="mb-4 font-display text-2xl font-medium">{t('stories.eyebrow')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories?.items.map((s) => <StoryCard key={s.id} story={s} showFollow={false} />)}
        </div>
        {!stories?.items.length && <p className="text-sm text-muted-foreground">{t('stories.empty')}</p>}
      </section>
    </div>
  );
}
