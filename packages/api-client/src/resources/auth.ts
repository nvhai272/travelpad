import type { AuthTokens, LoginInput, RegisterInput } from '@travelpad/contracts';
import type { Request } from '../http.js';

export const authResource = (request: Request) => ({
  register: (input: RegisterInput) => request<AuthTokens>('POST', '/auth/register', input),
  login: (input: LoginInput) => request<AuthTokens>('POST', '/auth/login', input),
  refresh: (refreshToken?: string) => request<AuthTokens>('POST', '/auth/refresh', { refreshToken }),
  logout: () => request<void>('POST', '/auth/logout'),
});
