import * as argon2 from 'argon2';
import type { User } from '@prisma/client';
import { reviewerSeeds, voterNames } from '../data/community.data.js';
import { DEV_PASSWORD, emailOf, prisma } from '../shared.js';

export type SeedUsers = { minhAnh: User; people: User[]; voters: User[]; by: (username: string) => User };

const upsertUser = (username: string, data: Omit<Parameters<typeof prisma.user.create>[0]['data'], 'email' | 'username'>) =>
  prisma.user.upsert({ where: { email: emailOf(username) }, update: {}, create: { ...data, email: emailOf(username), username } });

/** Người dùng mẫu (đăng nhập dev bằng DEV_PASSWORD): Minh Anh, Tuấn Dũng, Lan Phạm, người viết nhận xét, lữ khách vote. */
export async function seedUsers(): Promise<SeedUsers> {
  const passwordHash = await argon2.hash(DEV_PASSWORD);
  const minhAnh = await upsertUser('minhanh', { displayName: 'Minh Anh', avatarUrl: '/images/minh-anh.jpg', level: 4, xp: 1250, passwordHash });

  for (const [username, displayName] of [['tuandung', 'Tuấn Dũng'], ['lanpham', 'Lan Phạm']] as const) {
    await upsertUser(username, { displayName, passwordHash, level: 3 });
  }

  // Quản trị duyệt nhà cung cấp (BR-CONN-06)
  await prisma.user.upsert({
    where: { email: emailOf('admin') }, update: { role: 'ADMIN' },
    create: { email: emailOf('admin'), username: 'admin', displayName: 'Quản trị TravelPad', role: 'ADMIN', passwordHash },
  });

  const people = [minhAnh];
  for (const { username, ...rest } of reviewerSeeds) people.push(await upsertUser(username, { ...rest, passwordHash }));

  const voters: User[] = [];
  for (const [i, displayName] of voterNames.entries()) {
    voters.push(await upsertUser(`luukhach${String(i + 1).padStart(2, '0')}`, { displayName, passwordHash }));
  }
  return { minhAnh, people, voters, by: (u) => people.find((p) => p.username === u)! };
}
