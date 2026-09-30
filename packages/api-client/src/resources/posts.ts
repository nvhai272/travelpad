import type { Comment, CreateCommentInput, CreatePostInput, Paginated, PostDetail, PostSummary } from '@travelpad/contracts';
import type { Request } from '../http.js';

export const postsResource = (request: Request) => ({
  feed: (params: { cursor?: string; q?: string; limit?: number } = {}) => request<Paginated<PostSummary>>('GET', '/posts', undefined, params),
  bySlug: (slug: string) => request<PostDetail>('GET', `/posts/${slug}`),
  create: (input: CreatePostInput) => request<PostDetail>('POST', '/posts', input),
  like: (id: string) => request<void>('PUT', `/posts/${id}/like`),
  unlike: (id: string) => request<void>('DELETE', `/posts/${id}/like`),
  save: (id: string) => request<void>('PUT', `/posts/${id}/bookmark`),
  unsave: (id: string) => request<void>('DELETE', `/posts/${id}/bookmark`),
  comments: (id: string, cursor?: string) => request<Paginated<Comment>>('GET', `/posts/${id}/comments`, undefined, { cursor }),
  addComment: (id: string, input: CreateCommentInput) => request<Comment>('POST', `/posts/${id}/comments`, input),
});
