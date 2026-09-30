'use client';

import { useTranslations } from 'next-intl';
import type { MyProviderDetail } from '@travelpad/contracts';
import { FormField, inputClass } from '@/components/ui/form-field';

/** Nhóm trường "Liên hệ" + "Xác minh" (giấy phép – chỉ quản trị thấy). */
export function ContactLegalFields({ initial, errors, section }: { initial?: MyProviderDetail; errors: Record<string, string>; section: 'contact' | 'legal' }) {
  const t = useTranslations('providerSignup');
  if (section === 'contact') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label={t('phone')} error={errors.phone}>
          <input name="phone" inputMode="tel" defaultValue={initial?.phone} required aria-invalid={!!errors.phone} className={inputClass} />
        </FormField>
        <FormField label={t('zalo')} error={errors.zalo}>
          <input name="zalo" inputMode="tel" defaultValue={initial?.zalo ?? ''} aria-invalid={!!errors.zalo} className={inputClass} />
        </FormField>
        <FormField label={t('website')} error={errors.website}>
          <input name="website" type="url" defaultValue={initial?.website ?? ''} placeholder="https://" aria-invalid={!!errors.website} className={inputClass} />
        </FormField>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <FormField label={t('license')} error={errors.licenseNumber} hint={t('licenseHint')}>
        <input name="licenseNumber" defaultValue={initial?.licenseNumber ?? ''} required aria-invalid={!!errors.licenseNumber} className={inputClass} />
      </FormField>
      <label className="flex items-start gap-2 text-sm">
        <input name="acceptTerms" type="checkbox" required className="mt-1 size-4 accent-[var(--primary)]" />
        <span>{t('terms')}{errors.acceptTerms && <span className="block text-xs text-destructive">{errors.acceptTerms}</span>}</span>
      </label>
    </div>
  );
}
