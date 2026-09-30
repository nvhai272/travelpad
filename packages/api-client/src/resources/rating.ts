import type { CreateReviewInput, MyRating } from '@travelpad/contracts';
import type { Request } from '../http.js';

/** Vote sao "của tôi" – cùng hình dạng cho địa điểm và nhà cung cấp. */
export const ratingEndpoints = (request: Request, base: '/places' | '/providers') => ({
  rate: (id: string, input: CreateReviewInput) => request<MyRating>('PUT', `${base}/${id}/reviews/me`, input),
  myRating: (id: string) => request<MyRating>('GET', `${base}/${id}/reviews/me`),
  removeRating: (id: string) => request<MyRating>('DELETE', `${base}/${id}/reviews/me`),
});
