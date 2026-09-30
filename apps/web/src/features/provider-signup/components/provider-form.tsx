'use client';

import { useTranslations } from 'next-intl';
import type { MyProviderDetail, PlaceSummary, RegisterProviderInput } from '@travelpad/contracts';
import { useProviderForm } from '../hooks/use-provider-form';
import { ContactLegalFields } from './contact-legal-fields';
import { ServiceFields } from './service-fields';

type Props = {
  destinations: PlaceSummary[];
  initial?: MyProviderDetail;
  onSave: (input: RegisterProviderInput) => Promise<void>;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <h2 className="mb-4 font-display text-2xl font-medium">{title}</h2>
      {children}
    </section>
  );
}

/** Form hồ sơ nhà cung cấp – dùng cho đăng ký mới và sửa rồi gửi lại (BR-CONN-06). */
export function ProviderForm({ destinations, initial, onSave }: Props) {
  const t = useTranslations('providerSignup');
  const { errors, formError, saving, submit } = useProviderForm(onSave, (field) =>
    t.has(`errors.${field}` as 'errors.other') ? t(`errors.${field}` as 'errors.other') : t('errors.other'));
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); void submit(e.currentTarget); }} className="space-y-5">
      <Section title={t('sectionService')}><ServiceFields destinations={destinations} initial={initial} errors={errors} /></Section>
      <Section title={t('sectionContact')}><ContactLegalFields section="contact" initial={initial} errors={errors} /></Section>
      <Section title={t('sectionLegal')}><ContactLegalFields section="legal" initial={initial} errors={errors} /></Section>
      {formError && <p className="text-sm text-destructive">{formError === 'invalid' ? t('invalid') : formError}</p>}
      <button type="submit" disabled={saving}
        className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 sm:w-auto sm:px-8">
        {initial ? t('resubmit') : t('submit')}
      </button>
    </form>
  );
}
