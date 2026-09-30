import type { User } from '@prisma/client';
import { pendingRegistration, providerOwners, providers, providerVotes } from '../data/providers.data.js';
import { daysAgo, prisma } from '../shared.js';

/** Nhà cung cấp Kết nối du lịch (dữ liệu giả). */
export async function seedProviders(destId: Map<string, string>) {
  for (const [i, [slug, name, type, dest, priceFrom, priceUnit, languages, verified, description]] of providers.entries()) {
    const data = {
      name, type, destinationId: destId.get(dest)!, priceFrom, priceUnit, languages, verified, description,
      phone: `0900 000 ${String(100 + i).padStart(3, '0')}`, zalo: `0900000${100 + i}`, status: 'active' as const,
      // Chưa có ảnh riêng: để trống (web hiện ô theo loại dịch vụ) – không mượn ảnh điểm đến; ảnh thật do nhà cung cấp tải lên (TL-718)
      coverUrl: null,
    };
    await prisma.serviceProvider.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  }
}

/** Gán chủ dịch vụ → tài khoản chuyển sang loại "Nhà cung cấp"; chủ không vote dịch vụ của mình (BR-CONN-10). */
export async function seedProviderOwners() {
  await prisma.user.updateMany({ data: { accountType: 'traveler' } });
  for (const [slug, username] of Object.entries(providerOwners)) {
    const owner = await prisma.user.update({ where: { username }, data: { accountType: 'provider' } });
    await prisma.serviceProvider.update({ where: { slug }, data: { ownerId: owner.id } });
  }
}

/** Một hồ sơ đăng ký đang chờ duyệt (chủ vẫn là "Người trải nghiệm" cho tới khi được duyệt). */
export async function seedPendingRegistration(destId: Map<string, string>) {
  const { slug, owner, destination, ...rest } = pendingRegistration;
  const user = await prisma.user.findUniqueOrThrow({ where: { username: owner } });
  const data = { ...rest, destinationId: destId.get(destination)!, ownerId: user.id, status: 'pending' as const, languages: [], coverUrl: null };
  await prisma.serviceProvider.upsert({ where: { slug }, update: data, create: { slug, ...data } });
}

/** Vote sao nhà cung cấp – mỗi người vote đều đã gửi yêu cầu kết nối (BR-CONN-07). */
export async function seedProviderVotes(voters: User[]) {
  await prisma.providerReview.deleteMany({});
  await prisma.connectRequest.deleteMany({});
  for (const [slug, n, target] of providerVotes) {
    const prov = await prisma.serviceProvider.findUniqueOrThrow({ where: { slug } });
    const fives = Math.round((target - 4) * n);
    for (const [i, v] of voters.slice(0, n).entries()) {
      await prisma.connectRequest.create({
        data: { providerId: prov.id, userId: v.id, message: 'Mình muốn hỏi lịch trống và giá cho chuyến sắp tới.', status: 'closed', createdAt: daysAgo(30 + i) },
      });
      await prisma.providerReview.create({ data: { providerId: prov.id, authorId: v.id, rating: i < fives ? 5 : 4, createdAt: daysAgo(25 + i) } });
    }
  }
  await prisma.$executeRaw`
    UPDATE "ServiceProvider" p SET "ratingAvg" = COALESCE(s.avg, 0), "reviewCount" = COALESCE(s.n, 0)
    FROM (SELECT sp.id, AVG(r.rating)::float AS avg, COUNT(r.id)::int AS n FROM "ServiceProvider" sp
          LEFT JOIN "ProviderReview" r ON r."providerId" = sp.id GROUP BY sp.id) s WHERE p.id = s.id`;
}
