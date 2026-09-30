import type { PagedResult, Story, StoryQuery, UserSummary } from '@travelpad/contracts';
import type { Request } from '../http.js';

export const storiesResource = (request: Request) => ({
  list: (q: { page?: number; pageSize?: number; following?: boolean; author?: string } = {}) =>
    request<PagedResult<Story>>('GET', '/stories', undefined, { ...q, following: q.following ? 'true' : undefined } as Partial<Record<keyof StoryQuery, string | number>>),
});

export const followsResource = (request: Request) => ({
  follow: (username: string) => request<void>('PUT', `/users/${username}/follow`),
  unfollow: (username: string) => request<void>('DELETE', `/users/${username}/follow`),
  following: () => request<{ items: UserSummary[] }>('GET', '/me/following'),
});
