import type { Footprint, Journey, Paginated, UserProfile } from '@travelpad/contracts';
import type { Request } from '../http.js';

export const usersResource = (request: Request) => ({
  me: () => request<UserProfile>('GET', '/users/me'),
  byUsername: (username: string) => request<UserProfile>('GET', `/users/${username}`),
  footprints: () => request<Footprint[]>('GET', '/users/me/footprints'),
});

export const journeysResource = (request: Request) => ({
  byId: (id: string) => request<Journey>('GET', `/journeys/${id}`),
  ofUser: (username: string) => request<Paginated<Journey>>('GET', `/users/${username}/journeys`),
});
