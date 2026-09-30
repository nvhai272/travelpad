import { commentTexts, stories } from '../data/community.data.js';
import { prisma } from '../shared.js';
import type { SeedUsers } from './users.seed.js';

/** Bài chia sẻ + lượt tim + bình luận thật. Minh Anh tự thả tim 1 lần để kiểm tra BR-POST-03 (không tính BXH). */
export async function seedPosts({ people, voters, by }: SeedUsers) {
  const allFans = [...voters, ...people];
  for (const [slug, author, title, content, placeSlug, likes, hoursAgo] of stories) {
    const u = by(author);
    const place = await prisma.place.findUniqueOrThrow({ where: { slug: placeSlug } });
    const data = {
      title, excerpt: content, content, authorId: u.id, placeId: place.id, status: 'published' as const,
      coverUrl: place.coverUrl, publishedAt: new Date(Date.now() - hoursAgo * 3_600_000), gallery: [], tags: [],
    };
    const post = await prisma.post.upsert({ where: { slug }, update: data, create: { slug, ...data } });
    await prisma.postLike.deleteMany({ where: { postId: post.id } });
    await prisma.comment.deleteMany({ where: { postId: post.id } });
    const fans = allFans.filter((f) => f.id !== u.id).slice(0, likes);
    await prisma.postLike.createMany({ data: fans.map((f) => ({ postId: post.id, userId: f.id })) });
    if (author === 'minhanh') await prisma.postLike.create({ data: { postId: post.id, userId: u.id } }); // tự thả tim: hiện trên bài, không tính BXH
    for (const [i, text] of commentTexts.entries()) {
      await prisma.comment.create({ data: { postId: post.id, authorId: fans[i]!.id, content: text } });
    }
    await prisma.post.update({
      where: { id: post.id },
      data: { likeCount: fans.length + (author === 'minhanh' ? 1 : 0), commentCount: commentTexts.length },
    });
  }
}
