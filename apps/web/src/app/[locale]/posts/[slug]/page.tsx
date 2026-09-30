import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { serverApi, safe } from '@/lib/api';
import { Avatar } from '@/components/ui/avatar';

type Props = { params: Promise<{ locale: string; slug: string }> };
const load = (slug: string) => safe(serverApi.posts.bySlug(slug), null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await load((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: { type: 'article', images: post.coverUrl ? [post.coverUrl] : [], publishedTime: post.publishedAt },
  };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await load(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl py-4">
      <h1 className="font-display text-4xl leading-tight md:text-5xl">{post.title}</h1>
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Avatar user={post.author} size={28} /> {post.author.displayName} · {new Date(post.publishedAt).toLocaleDateString(locale)}
      </div>
      {/* TODO(Phase 1): render Markdown an toàn, nút thích/lưu (client), bình luận */}
      <div className="prose mt-8 whitespace-pre-line leading-relaxed">{post.content}</div>
    </article>
  );
}
