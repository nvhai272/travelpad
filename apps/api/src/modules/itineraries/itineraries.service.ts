import { Injectable, NotFoundException } from '@nestjs/common';
import { SLOT_PREFERENCES, type Itinerary, type ItineraryQuery, type ItinerarySlot } from '@travelpad/contracts';
import { toPlaceSummary } from '../../common/mappers/index.js';
import { PrismaService } from '../../prisma/prisma.service.js';

const SLOTS: ItinerarySlot[] = ['morning', 'noon', 'afternoon', 'evening'];

/**
 * Gợi ý lịch trình theo quy tắc (BR-ITIN-01..04). Phase 4 thay/kết hợp bằng AI cá nhân hoá,
 * nhưng vẫn chỉ chọn trong dữ liệu địa điểm thật của TravelPad.
 */
@Injectable()
export class ItinerariesService {
  constructor(private readonly prisma: PrismaService) {}

  async suggest(q: ItineraryQuery): Promise<Itinerary> {
    const dest = await this.prisma.place.findFirst({ where: { slug: q.destination, kind: 'destination' } });
    if (!dest) throw new NotFoundException({ code: 'DESTINATION_NOT_FOUND', message: 'Không tìm thấy điểm đến' });

    // Ứng viên: địa điểm con, ưu tiên nhiều người vote rồi sao cao (cùng thứ tự với BXH địa điểm)
    const spots = await this.prisma.place.findMany({
      where: { parentId: dest.id, kind: 'spot' },
      orderBy: [{ reviewCount: 'desc' }, { ratingAvg: 'desc' }],
    });
    const used = new Set<string>();
    const pick = (slot: ItinerarySlot) => {
      for (const cat of SLOT_PREFERENCES[slot]) {
        const p = spots.find((s) => s.category === cat && !used.has(s.id));
        if (p) { used.add(p.id); return p; }
      }
      // Buổi tối được lặp lại chỗ nghỉ đã chọn (ở nhiều đêm cùng một nơi là bình thường)
      if (slot === 'evening') return spots.find((s) => s.category === 'stay') ?? null;
      return null;
    };

    return {
      destination: toPlaceSummary(dest),
      days: Array.from({ length: q.days }, (_, i) => ({
        day: i + 1,
        slots: SLOTS.map((slot) => {
          const p = pick(slot);
          return { slot, place: p ? toPlaceSummary(p) : null };
        }),
      })),
    };
  }
}
