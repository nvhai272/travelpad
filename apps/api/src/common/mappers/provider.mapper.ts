import type { Prisma } from '@prisma/client';
import type { AdminProvider, MyProvider, MyProviderDetail, ProviderSummary } from '@travelpad/contracts';
import { toUserSummary, userSummarySelect } from './user.mapper.js';

export const providerInclude = {
  destination: { select: { id: true, slug: true, name: true, province: true } },
} satisfies Prisma.ServiceProviderInclude;

export type ProviderRow = Prisma.ServiceProviderGetPayload<{ include: typeof providerInclude }>;

/** "0912345678" → "0912 ••• 678" – khách chỉ thấy bản che (BR-CONN-03). */
export const maskPhone = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  return d.length < 7 ? '•••' : `${d.slice(0, 4)} ••• ${d.slice(-3)}`;
};

export const toProviderSummary = (p: ProviderRow): ProviderSummary => ({
  id: p.id, slug: p.slug, name: p.name, type: p.type, destination: p.destination,
  priceFrom: p.priceFrom, priceUnit: p.priceUnit, languages: p.languages, coverUrl: p.coverUrl,
  verified: p.verified, ratingAvg: Math.round(p.ratingAvg * 10) / 10, reviewCount: p.reviewCount,
  maskedPhone: maskPhone(p.phone),
});

export const toMyProvider = (p: ProviderRow): MyProvider => ({
  ...toProviderSummary(p), status: p.status, rejectReason: p.rejectReason, submittedAt: p.updatedAt.toISOString(),
});

export const toMyProviderDetail = (p: ProviderRow): MyProviderDetail => ({
  ...toMyProvider(p), description: p.description, address: p.address, phone: p.phone, zalo: p.zalo,
  website: p.website, licenseNumber: p.licenseNumber,
});

export const adminProviderInclude = { ...providerInclude, owner: { select: userSummarySelect } } satisfies Prisma.ServiceProviderInclude;
type AdminRow = Prisma.ServiceProviderGetPayload<{ include: typeof adminProviderInclude }>;

export const toAdminProvider = (p: AdminRow): AdminProvider => ({
  ...toMyProviderDetail(p), owner: p.owner ? toUserSummary(p.owner) : null,
});
