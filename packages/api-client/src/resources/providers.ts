import type {
  AdminProvider, ApproveProviderInput, CreateConnectRequestInput, MyProvider, MyProviderDetail, ProviderContact,
  ProviderDetail, ProviderQuery, ProviderStatus, ProviderSummary, RegisterProviderInput, RejectProviderInput,
} from '@travelpad/contracts';
import type { Request } from '../http.js';
import { ratingEndpoints } from './rating.js';

export const providersResource = (request: Request) => ({
  list: (q: Partial<ProviderQuery> = {}) => request<{ items: ProviderSummary[] }>('GET', '/providers', undefined, q),
  bySlug: (slug: string) => request<ProviderDetail>('GET', `/providers/${slug}`),
  contact: (id: string) => request<ProviderContact>('GET', `/providers/${id}/contact`),
  requestConnect: (id: string, input: CreateConnectRequestInput) => request<{ id: string }>('POST', `/providers/${id}/requests`, input),
  ...ratingEndpoints(request, '/providers'),
});

/** Đăng ký & quản lý dịch vụ của tôi (BR-CONN-06). */
export const myProvidersResource = (request: Request) => ({
  list: () => request<{ items: MyProvider[] }>('GET', '/me/providers'),
  detail: (id: string) => request<MyProviderDetail>('GET', `/me/providers/${id}`),
  register: (input: RegisterProviderInput) => request<MyProvider>('POST', '/me/providers', input),
  resubmit: (id: string, input: RegisterProviderInput) => request<MyProvider>('PUT', `/me/providers/${id}`, input),
});

/** Quản trị duyệt nhà cung cấp. */
export const adminProvidersResource = (request: Request) => ({
  list: (status: ProviderStatus = 'pending') => request<{ items: AdminProvider[] }>('GET', '/admin/providers', undefined, { status }),
  approve: (id: string, input: ApproveProviderInput) => request<AdminProvider>('POST', `/admin/providers/${id}/approve`, input),
  reject: (id: string, input: RejectProviderInput) => request<AdminProvider>('POST', `/admin/providers/${id}/reject`, input),
});
