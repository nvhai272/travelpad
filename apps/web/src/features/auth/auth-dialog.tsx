'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ApiClientError } from '@travelpad/api-client';
import { Overlay } from '@/components/ui/overlay';
import { useApp } from '@/features/app/app-provider';

const inputCls =
  'mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20';

export function AuthDialog() {
  const t = useTranslations();
  const { authOpen, closeAuth, signIn, signUp } = useApp();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const email = String(f.get('email')), password = String(f.get('password'));
      if (mode === 'signIn') await signIn(email, password);
      else await signUp(email, password, String(f.get('displayName')));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.error.message : t('common.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Overlay open={authOpen} onClose={closeAuth} variant="dialog" label={t('auth.title')}>
      <h2 className="font-display text-2xl font-medium">{mode === 'signIn' ? t('auth.title') : t('auth.signUpTitle')}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('auth.lead')}</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        {mode === 'signUp' && (
          <label className="block text-xs font-semibold text-muted-foreground">
            {t('auth.displayName')}
            <input name="displayName" required minLength={2} placeholder="Minh Anh" className={inputCls} />
          </label>
        )}
        <label className="block text-xs font-semibold text-muted-foreground">
          {t('auth.email')}
          <input name="email" type="email" required placeholder="minhanh@email.com" autoComplete="email" className={inputCls} />
        </label>
        <label className="block text-xs font-semibold text-muted-foreground">
          {t('auth.password')}
          <input name="password" type="password" required minLength={8} placeholder="••••••••" className={inputCls}
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'} />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={busy} className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {mode === 'signIn' ? t('nav.signIn') : t('nav.signUp')}
        </button>
      </form>
      <button onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
        {mode === 'signIn' ? t('auth.toSignUp') : t('auth.toSignIn')}
      </button>
    </Overlay>
  );
}
