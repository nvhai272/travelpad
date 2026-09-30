import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { UserSummary } from '@travelpad/contracts';
import { toUserSummary, userSummarySelect } from '../../common/mappers/index.js';
import { PrismaService } from '../../prisma/prisma.service.js';

/** Theo dõi một chiều (BR-FOL-01..03): không cần người kia đồng ý, không tự theo dõi mình, idempotent. */
@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: string, username: string) {
    const target = await this.target(username);
    if (target.id === followerId) throw new BadRequestException({ code: 'FOLLOW_SELF', message: 'Bạn không thể tự theo dõi chính mình' });
    await this.prisma.follow.createMany({ data: [{ followerId, followingId: target.id }], skipDuplicates: true });
    // TODO(TL-703): thông báo "X bắt đầu theo dõi bạn"
  }

  async unfollow(followerId: string, username: string) {
    const target = await this.target(username);
    await this.prisma.follow.deleteMany({ where: { followerId, followingId: target.id } });
  }

  async following(userId: string): Promise<{ items: UserSummary[] }> {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: userId }, orderBy: { createdAt: 'desc' }, include: { following: { select: userSummarySelect } },
    });
    return { items: rows.map((r) => toUserSummary(r.following)) };
  }

  private async target(username: string) {
    const u = await this.prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!u) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng' });
    return u;
  }
}
