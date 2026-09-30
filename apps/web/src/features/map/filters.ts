import type { PlaceCategory, Region } from '@travelpad/contracts';

export type SearchFilters = { region: Region | 'all'; category: PlaceCategory | 'all'; price: 0 | 1 | 2 | 3; minRating: 0 | 4 | 4.5 | 4.8 };
export const EMPTY_FILTERS: SearchFilters = { region: 'all', category: 'all', price: 0, minRating: 0 };
export const REGIONS: Region[] = ['north', 'central', 'highlands', 'south'];
export const CATEGORIES: PlaceCategory[] = ['food', 'stay', 'camping', 'hiking', 'sightseeing'];
export const CATEGORY_EMOJI: Record<PlaceCategory, string> = { food: '🍜', stay: '🏝️', camping: '⛺', hiking: '⛰️', sightseeing: '📸', other: '📍' };

export const activeFilterCount = (f: SearchFilters) =>
  Number(f.region !== 'all') + Number(f.category !== 'all') + Number(f.price !== 0) + Number(f.minRating !== 0);

