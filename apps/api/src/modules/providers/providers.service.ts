import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {
  CONNECT_REQUESTS_PER_DAY, PROVIDER_GROUPS,
  type CreateConnectRequestInput, type ProviderContact, type ProviderDetail, type ProviderQuery, type ProviderSummary,
} from '@travelpad/contracts';
import { providerInclude, toProviderSummary } from '../../common/mappers/index.js';
import { summarizeRatings } from '../../common/rating/rating-summary.js';
import { PrismaService } from '../../prisma/prisma.service.js';

const NOT_FOUND = { code: 'PROVIDER_NOT_FOUND', message: 'Không tìm thấy nhà cung cấp' };

/** Kết nối du lịch: danh bạ, chi tiết, liên hệ và yêu cầu kết nối (BR-CONN-01..04). */
@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: ProviderQuery): Promise<{ items: ProviderSummary[] }> {
    const rows = await this.prisma.serviceProvider.findMany({
      where: {
        status: 'active', // BR-CONN-02: chỉ hiện nhà cung cấp đã duyệt
        ...(q.destination ? { destination: { slug: q.destination } } : {}),
        ...(q.type ? { type: q.type } : q.group ? { type: { in: PROVIDER_GROUPS[q.group] } } : {}),
        ...(q.q
          ? { OR: [
              { name: { contains: q.q, mode: 'insensitive' } },
              { destination: { name: { contains: q.q, mode: 'insensitive' } } },
              { destination: { province: { contains: q.q, mode: 'insensitive' } } },
            ] }
          : {}),
      },
      // Đã xác minh lên trước, rồi nhiều đánh giá, rồi mới nhất
      orderBy: [{ verified: 'desc' }, { reviewCount: 'desc' }, { createdAt: 'desc' }],
      take: q.limit,
      include: providerInclude,
    });
    return { items: rows.map(toProviderSummary) };
  }

  async bySlug(slug: string): Promise<ProviderDetail> {
    const p = await this.prisma.serviceProvider.findFirst({ where: { slug, status: 'active' }, include: providerInclude });
    if (!p) throw new NotFoundException(NOT_FOUND);
    const groups = await this.prisma.providerReview.groupBy({ by: ['rating'], where: { providerId: p.id }, _count: true });
    return {
      ...toProviderSummary(p), description: p.description, address: p.address,
      ratingDistribution: summarizeRatings(groups).distribution,
    };
  }

  /** Liên hệ đầy đủ – controller chỉ cho thành viên gọi (BR-CONN-03). */
  async contact(id: string): Promise<ProviderContact> {
    const p = await this.prisma.serviceProvider.findFirst({ where: { id, status: 'active' }, select: { phone: true, zalo: true, website: true } });
    if (!p) throw new NotFoundException(NOT_FOUND);
    return p;
  }

  async request(providerId: string, userId: string, input: CreateConnectRequestInput) {
    const provider = await this.prisma.serviceProvider.findFirst({ where: { id: providerId, status: 'active' }, select: { ownerId: true } });
    if (!provider) throw new NotFoundException(NOT_FOUND);
    if (provider.ownerId === userId) throw new ForbiddenException({ code: 'OWN_SERVICE', message: 'Bạn không thể gửi yêu cầu tới dịch vụ của chính mình' });
    const today = await this.prisma.connectRequest.count({ where: { userId, createdAt: { gte: new Date(Date.now() - 86_400_000) } } });
    if (today >= CONNECT_REQUESTS_PER_DAY) {
      throw new HttpException({ code: 'TOO_MANY_REQUESTS', message: `Mỗi ngày bạn gửi được tối đa ${CONNECT_REQUESTS_PER_DAY} yêu cầu. Hẹn bạn ngày mai nhé` }, HttpStatus.TOO_MANY_REQUESTS);
    }
    const r = await this.prisma.connectRequest.create({
      data: {
        providerId, userId, message: input.message, people: input.people, contactPhone: input.contactPhone,
        travelDate: input.travelDate ? new Date(input.travelDate) : undefined,
      },
    });
    // TODO(TL-712): thông báo cho nhà cung cấp (email/Zalo OA) + trang quản lý yêu cầu
    return { id: r.id };
  }
}
