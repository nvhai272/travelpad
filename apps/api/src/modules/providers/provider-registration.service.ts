import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
  MAX_PENDING_REGISTRATIONS, type MyProvider, type MyProviderDetail, type RegisterProviderInput,
} from '@travelpad/contracts';
import { providerInclude, toMyProvider, toMyProviderDetail } from '../../common/mappers/index.js';
import { slugify } from '../../common/text/slugify.js';
import { PrismaService } from '../../prisma/prisma.service.js';

const NOT_FOUND = { code: 'PROVIDER_NOT_FOUND', message: 'Không tìm thấy hồ sơ nhà cung cấp' };

/** Đăng ký nhà cung cấp & "Dịch vụ của tôi" (BR-CONN-06): tạo hồ sơ chờ duyệt, sửa rồi gửi lại. */
@Injectable()
export class ProviderRegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  async register(userId: string, input: RegisterProviderInput): Promise<MyProvider> {
    const pending = await this.prisma.serviceProvider.count({ where: { ownerId: userId, status: 'pending' } });
    if (pending >= MAX_PENDING_REGISTRATIONS) {
      throw new ConflictException({ code: 'TOO_MANY_PENDING', message: `Bạn đang có ${MAX_PENDING_REGISTRATIONS} hồ sơ chờ duyệt – vui lòng đợi kết quả trước khi gửi thêm` });
    }
    const data = await this.toData(input);
    const p = await this.prisma.serviceProvider.create({
      data: { ...data, slug: await this.uniqueSlug(input.name, input.destinationSlug), ownerId: userId, status: 'pending' },
      include: providerInclude,
    });
    // TODO(TL-712): thông báo quản trị có hồ sơ mới
    return toMyProvider(p);
  }

  async listMine(userId: string): Promise<{ items: MyProvider[] }> {
    const rows = await this.prisma.serviceProvider.findMany({ where: { ownerId: userId }, orderBy: { updatedAt: 'desc' }, include: providerInclude });
    return { items: rows.map(toMyProvider) };
  }

  async getMine(userId: string, id: string): Promise<MyProviderDetail> {
    const p = await this.prisma.serviceProvider.findFirst({ where: { id, ownerId: userId }, include: providerInclude });
    if (!p) throw new NotFoundException(NOT_FOUND);
    return toMyProviderDetail(p);
  }

  /** Chỉ sửa được hồ sơ đang chờ hoặc bị từ chối; sửa xong quay về "chờ duyệt". Dịch vụ đang hoạt động: TL-717. */
  async resubmit(userId: string, id: string, input: RegisterProviderInput): Promise<MyProvider> {
    const current = await this.prisma.serviceProvider.findFirst({ where: { id, ownerId: userId }, select: { status: true } });
    if (!current) throw new NotFoundException(NOT_FOUND);
    if (current.status !== 'pending' && current.status !== 'rejected') {
      throw new BadRequestException({ code: 'NOT_EDITABLE', message: 'Chỉ sửa được hồ sơ đang chờ duyệt hoặc chưa được duyệt' });
    }
    const p = await this.prisma.serviceProvider.update({
      where: { id },
      data: { ...(await this.toData(input)), status: 'pending', rejectReason: null },
      include: providerInclude,
    });
    return toMyProvider(p);
  }

  private async toData(input: RegisterProviderInput) {
    const dest = await this.prisma.place.findFirst({ where: { slug: input.destinationSlug, kind: 'destination' }, select: { id: true } });
    if (!dest) throw new BadRequestException({ code: 'DESTINATION_NOT_FOUND', message: 'Điểm đến không hợp lệ' });
    const { destinationSlug: _d, acceptTerms: _a, ...rest } = input;
    return { ...rest, destinationId: dest.id, address: rest.address ?? null, zalo: rest.zalo ?? null, website: rest.website ?? null };
  }

  private async uniqueSlug(name: string, destination: string) {
    const base = slugify(`${name} ${destination}`) || 'dich-vu';
    for (let i = 0; ; i++) {
      const slug = i === 0 ? base : `${base}-${i + 1}`;
      if (!(await this.prisma.serviceProvider.count({ where: { slug } }))) return slug;
    }
  }
}
