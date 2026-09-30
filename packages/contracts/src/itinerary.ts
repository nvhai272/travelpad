import { z } from 'zod';
import { PlaceCategorySchema, PlaceSummarySchema } from './place.js';

export const ItinerarySlotSchema = z.enum(['morning', 'noon', 'afternoon', 'evening']);
export type ItinerarySlot = z.infer<typeof ItinerarySlotSchema>;

/** BR-ITIN-02: loại địa điểm ưu tiên cho từng buổi (theo thứ tự). */
export const SLOT_PREFERENCES: Record<ItinerarySlot, z.infer<typeof PlaceCategorySchema>[]> = {
  morning: ['sightseeing', 'hiking'],
  noon: ['food'],
  afternoon: ['hiking', 'camping', 'sightseeing'],
  evening: ['stay', 'food', 'camping'],
};

export const ItineraryQuerySchema = z.object({
  destination: z.string().min(1), // slug điểm đến
  days: z.coerce.number().int().min(1).max(5).default(2),
});
export type ItineraryQuery = z.infer<typeof ItineraryQuerySchema>;

export const ItinerarySchema = z.object({
  destination: PlaceSummarySchema,
  days: z.array(
    z.object({
      day: z.number().int(),
      slots: z.array(z.object({ slot: ItinerarySlotSchema, place: PlaceSummarySchema.nullable() })),
    }),
  ),
});
export type Itinerary = z.infer<typeof ItinerarySchema>;
