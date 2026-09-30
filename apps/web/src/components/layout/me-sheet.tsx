'use client';

import { useTranslations } from 'next-intl';
import { ChevronRight, LogOut, Settings, ShieldCheck, Store, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Overlay } from '@/components/ui/overlay';
import { Link } from '@/i18n/routing';
import { useApp } from '@/features/app/app-provider';
import { UserAvatar } from '@/features/rankings/components/ranking-parts';

function Row({ icon: Icon, label, href, onClick, danger }: { icon: LucideIcon; label: string; href?: string; onClick?: () => void; danger?: boolean }) {
  const cls = `flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-medium hover:bg-secondary ${danger ? 'text-destructive' : ''}`;
  const inner = <><Icon className="size-5 shrink-0" /><span className="flex-1">{label}</span>{!danger && <ChevronRight className="size-4 text-muted-foreground" />}</>;
  return href ? <Link href={href} onClick={onClick} className={cls}>{inner}</Link> : <button onClick={onClick} className={`${cls} w-full text-left`}>{inner}</button>;
}

/** Bảng "Tôi" trên điện thoại: mọi lối vào cá nhân gom một chỗ (thay header chật + nút +). */
export function MeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations();
  const { user, openAuth, setSettingsOpen, signOut } = useApp();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  const go = (fn: () => void) => () => { onClose(); fn(); };

  return (
    <Overlay open={open} onClose={onClose} variant="bottom" label={t('nav.me')}>
      {user ? (
        <Link href={`/u/${user.username}`} onClick={onClose} className="mb-3 flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
          <UserAvatar user={user} size={48} />
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-medium">{user.displayName}</p>
            <p className="text-xs text-muted-foreground">{t(`rankings.accountType.${user.accountType}`)} · {t('profile.travelerLevel', { level: user.level })}</p>
          </div>
        </Link>
      ) : (
        <div className="mb-3 rounded-2xl bg-secondary/60 p-4">
          <p className="font-display text-2xl font-medium">{t('me.guestTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('me.guestLead')}</p>
          <button onClick={go(openAuth)} className="mt-3 h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            {t('nav.signIn')} / {t('me.signUp')}
          </button>
        </div>
      )}
      <nav className="space-y-0.5">
        {user && <Row icon={UserRound} label={t('me.myProfile')} href={`/u/${user.username}`} onClick={onClose} />}
        <Row icon={Store} label={user ? t('myProviders.title') : t('me.becomeProvider')} href={user ? '/me/providers' : '/connect/register'} onClick={onClose} />
        {isStaff && <Row icon={ShieldCheck} label={t('admin.title')} href="/admin/providers" onClick={onClose} />}
        <Row icon={Settings} label={t('nav.settings')} onClick={go(() => setSettingsOpen(true))} />
        {user && <Row icon={LogOut} label={t('nav.signOut')} onClick={go(() => void signOut())} danger />}
      </nav>
    </Overlay>
  );
}
