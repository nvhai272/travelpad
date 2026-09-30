import type { UserSummary } from '@travelpad/contracts';

export function Avatar({ user, size = 32 }: { user: Pick<UserSummary, 'displayName' | 'avatarUrl'>; size?: number }) {
  const initials = user.displayName.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase();
  return user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatarUrl} alt={user.displayName} width={size} height={size} className="rounded-full object-cover" />
  ) : (
    <span
      style={{ width: size, height: size }}
      className="inline-grid place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
    >
      {initials}
    </span>
  );
}
