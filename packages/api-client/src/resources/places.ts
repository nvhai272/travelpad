import type { Itinerary, Paginated, PlaceDetail, PlaceQuery, PlaceSummary, Review } from '@travelpad/contracts';
import type { Request } from '../http.js';
import { ratingEndpoints } from './rating.js';

export const placesResource = (request: Request) => ({
  list: (q: Partial<PlaceQuery> = {}) => request<Paginated<PlaceSummary>>('GET', '/places', undefined, q),
  bySlug: (slug: string) => request<PlaceDetail>('GET', `/places/${slug}`),
  reviews: (id: string, cursor?: string) => request<Paginated<Review>>('GET', `/places/${id}/reviews`, undefined, { cursor }),
  ...ratingEndpoints(request, '/places'),
});

export const reviewsResource = (request: Request) => ({
  markHelpful: (id: string) => request<void>('PUT', `/reviews/${id}/helpful`),
  unmarkHelpful: (id: string) => request<void>('DELETE', `/reviews/${id}/helpful`),
});

export const itinerariesResource = (request: Request) => ({
  suggest: (destination: string, days = 2) => request<Itinerary>('GET', '/itineraries/suggest', undefined, { destination, days }),
});
