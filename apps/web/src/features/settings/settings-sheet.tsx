'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Bell, Globe2, LogOut, Palette, Shield } from 'lucide-react';
import { Overlay } from '@/components/ui/overlay';
import { usePathname, useRouter } from '@/i18n/routing';
import { useApp, type ClientSettings } from '@/features/app/app-provider';
import { Segmented, SettingGroup, SettingSwitch } from './components/setting-controls';
import { VnFlag } from '@/components/brand/vn-flag';

export function SettingsSheet() {
  const t = useTranslations('settings');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { settings: s, updateSettings, settingsOpen, setSettingsOpen, signedIn, signOut, openAuth } = useApp();
  const set = (patch: Partial<ClientSettings>) => updateSettings(patch);

  return (
    <Overlay open={settingsOpen} onClose={() => setSettingsOpen(false)} variant="sheet" label={t('title')}>
      <h2 className="font-display text-2xl font-medium">{t('title')}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('lead')}</p>

      <div className="mt-6 space-y-5">
        <SettingGroup icon={Globe2} title={t('language')}>
          <div className="grid grid-cols-2 gap-2">
            {([['vi', 'Tiếng Việt'], ['en', 'English']] as const).map(([code, label]) => (
              <button key={code} onClick={() => router.replace(pathname, { locale: code })}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  locale === code ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/50 hover:bg-secondary'}`}>
                {code === 'vi' && <VnFlag className="h-3.5 w-5" />}{label}
              </button>
            ))}
          </div>
        </SettingGroup>

        <SettingGroup icon={Palette} title={t('display')}>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">{t('theme')}</p>
          <Segmented value={s.theme} onChange={(theme) => set({ theme })}
            options={[{ value: 'light', label: t('light') }, { value: 'dark', label: t('dark') }, { value: 'system', label: t('system') }]} />
          <p className="mb-2 mt-4 text-xs font-semibold text-muted-foreground">{t('mapStyle')}</p>
          <Segmented value={s.mapStyle} onChange={(mapStyle) => set({ mapStyle })}
            options={[{ value: 'classic', label: t('classic') }, { value: 'terrain', label: t('terrain') }, { value: 'satellite', label: t('satellite') }]} />
          <div className="mt-4">
            <SettingSwitch label={t('largeText')} checked={s.largeText} onChange={(largeText) => set({ largeText })} />
            <SettingSwitch label={t('dataSaver')} checked={s.dataSaver} onChange={(dataSaver) => set({ dataSaver })} />
          </div>
        </SettingGroup>

        <SettingGroup icon={Bell} title={t('notifications')}>
          <SettingSwitch label={t('notifyFollowing')} checked={s.notifyFollowing} onChange={(notifyFollowing) => set({ notifyFollowing })} />
          <SettingSwitch label={t('notifyHot')} checked={s.notifyHot} onChange={(notifyHot) => set({ notifyHot })} />
          <SettingSwitch label={t('notifyComments')} checked={s.notifyComments} onChange={(notifyComments) => set({ notifyComments })} />
        </SettingGroup>

        <SettingGroup icon={Shield} title={t('account')}>
          <SettingSwitch label={t('shareLocation')} checked={s.shareLocation} onChange={(shareLocation) => set({ shareLocation })} />
          {signedIn ? (
            <button onClick={() => { void signOut(); setSettingsOpen(false); }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-destructive">
              <LogOut className="size-4" /> {tNav('signOut')}
            </button>
          ) : (
            <button onClick={() => { setSettingsOpen(false); openAuth(); }}
              className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
              {tNav('signIn')}
            </button>
          )}
        </SettingGroup>
      </div>
    </Overlay>
  );
}
