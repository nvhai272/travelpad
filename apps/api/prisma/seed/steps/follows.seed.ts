import { follows } from '../data/community.data.js';
import { prisma } from '../shared.js';

/** Quan hệ theo dõi mẫu (thay cho bạn bè). */
export async function seedFollows() {
  await prisma.follow.deleteMany({});
  for (const [follower, following] of follows) {
    const [a, b] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { username: follower } }),
      prisma.user.findUniqueOrThrow({ where: { username: following } }),
    ]);
    await prisma.follow.create({ data: { followerId: a.id, followingId: b.id } });
  }
}
