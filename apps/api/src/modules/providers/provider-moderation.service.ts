import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { AdminProvider, ApproveProviderInput, ProviderStatus, RejectProviderInput } from '@travelpad/contracts';
import { adminProviderInclude, toAdminProvider } from '../../common/mappers/index.js';
import { PrismaService } from '../../prisma/prisma.service.js';

/** Quản trị duyệt hồ sơ nhà cung cấp (BR-CONN-05/06). */
@Injectable()
export class ProviderModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async list(status: ProviderStatus): Promise<{ items: AdminProvider[] }> {
    const rows = await this.prisma.serviceProvider.findMany({ where: { status }, orderBy: { updatedAt: 'asc' }, include: adminProviderInclude });
    return { items: rows.map(toAdminProvider) };
  }

  /** Duyệt → hiện công khai; chủ hồ sơ chuyển sang tài khoản "Nhà cung cấp" (BR-USER-01). */
  async approve(id: string, input: ApproveProviderInput): Promise<AdminProvider> {
    const current = await this.pending(id);
    return this.prisma.$transaction(async (tx) => {
      const p = await tx.serviceProvider.update({
        where: { id },
        data: { status: 'active', verified: input.verified, rejectReason: null, reviewedAt: new Date() },
        include: adminProviderInclude,
      });
      if (current.ownerId) await tx.user.update({ where: { id: current.ownerId }, data: { accountType: 'provider' } });
      // TODO(TL-712): thông báo cho chủ hồ sơ
      return toAdminProvider(p);
    });
  }

  async reject(id: string, input: RejectProviderInput): Promise<AdminProvider> {
    await this.pending(id);
    const p = await this.prisma.serviceProvider.update({
      where: { id },
      data: { status: 'rejected', rejectReason: input.reason, reviewedAt: new Date() },
      include: adminProviderInclude,
    });
    return toAdminProvider(p);
  }

  private async pending(id: string) {
    const p = await this.prisma.serviceProvider.findUnique({ where: { id }, select: { status: true, ownerId: true } });
    if (!p) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND', message: 'Không tìm thấy hồ sơ dịch vụ' });
    if (p.status !== 'pending') throw new BadRequestException({ code: 'NOT_PENDING', message: 'Hồ sơ này đã được xử lý' });
    return p;
  }
}
