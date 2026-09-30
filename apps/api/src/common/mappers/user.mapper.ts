import type { User } from '@prisma/client';
import type { UserSummary } from '@travelpad/contracts';

export const userSummarySelect = { id: true, username: true, displayName: true, avatarUrl: true, level: true, accountType: true } as const;

export const toUserSummary = (u: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'level' | 'accountType'>): UserSummary => ({
  id: u.id, username: u.username, displayName: u.displayName, avatarUrl: u.avatarUrl, level: u.level, accountType: u.accountType,
});
