import { z } from 'zod';
import { GeoPointSchema } from './common.js';
import { UserSummarySchema } from './user.js';

export const JourneyStopSchema = z.object({
  id: z.string(),
  order: z.number().int(),
  placeId: z.string().nullable(),
  name: z.string(),
  location: GeoPointSchema,
  arrivedAt: z.string().nullable(),
  note: z.string().nullable(),
});
export type JourneyStop = z.infer<typeof JourneyStopSchema>;

export const JourneySchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['planning', 'ongoing', 'completed']),
  visibility: z.enum(['public', 'friends', 'private']),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  owner: UserSummarySchema,
  stops: z.array(JourneyStopSchema),
  distanceKm: z.number(),
});
export type Journey = z.infer<typeof JourneySchema>;

export const CreateJourneySchema = z.object({
  title: z.string().min(3).max(120),
  visibility: z.enum(['public', 'friends', 'private']).default('public'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export type CreateJourneyInput = z.infer<typeof CreateJourneySchema>;

export const AddStopSchema = z.object({
  placeId: z.string().optional(),
  name: z.string().min(1).max(120),
  location: GeoPointSchema,
  arrivedAt: z.string().optional(),
  note: z.string().max(500).optional(),
});
export type AddStopInput = z.infer<typeof AddStopSchema>;
