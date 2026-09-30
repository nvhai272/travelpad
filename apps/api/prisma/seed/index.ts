import { spots } from './data/places.data.js';
import { stories } from './data/community.data.js';
import { providers } from './data/providers.data.js';
import { prisma } from './shared.js';
import { seedCheckins } from './steps/checkins.seed.js';
import { seedPlaces } from './steps/places.seed.js';
import { seedPosts } from './steps/posts.seed.js';
import { seedPendingRegistration, seedProviderOwners, seedProviders, seedProviderVotes } from './steps/providers.seed.js';
import { seedStarVotes, seedWrittenReviews } from './steps/reviews.seed.js';
import { seedUsers } from './steps/users.seed.js';
import { seedFollows } from './steps/follows.seed.js';

/**
 * Dữ liệu mẫu cho môi trường dev – chạy lại được nhiều lần (upsert/xoá rồi tạo lại).
 * Thứ tự quan trọng: địa điểm → người dùng → nội dung phụ thuộc cả hai.
 */
async function main() {
  const destId = await seedPlaces();
  const users = await seedUsers();
  await seedCheckins(users.minhAnh, users.people, destId);
  await seedWrittenReviews(users);
  await seedStarVotes(users.voters); // sau cùng: tính lại điểm từ mọi vote
  await seedPosts(users);
  await seedFollows();
  await seedProviders(destId);
  await seedProviderOwners();
  await seedProviderVotes(users.voters);
  await seedPendingRegistration(destId);
  console.log(`Seeded ${destId.size} destinations, ${spots.length} spots, ${stories.length} posts, ${providers.length} providers`);
}

main().finally(() => prisma.$disconnect());
