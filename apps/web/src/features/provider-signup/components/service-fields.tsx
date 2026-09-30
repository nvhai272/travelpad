'use client';

import { useTranslations } from 'next-intl';
import { PriceUnitSchema, PROVIDER_GROUPS, ProviderGroupSchema, type MyProviderDetail, type PlaceSummary } from '@travelpad/contracts';
import { FormField, inputClass } from '@/components/ui/form-field';

type Props = { destinations: PlaceSummary[]; initial?: MyProviderDetail; errors: Record<string, string> };

/** Nhóm trường "Thông tin dịch vụ": tên, loại (theo 4 nhóm), điểm đến, giá, mô tả. */
export function ServiceFields({ destinations, initial, errors }: Props) {
  const t = useTranslations();
  const err = (k: string) => ({ error: errors[k], invalid: !!errors[k] });
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label={t('providerSignup.name')} error={errors.name} className="sm:col-span-2">
        <input name="name" defaultValue={initial?.name} required minLength={3} maxLength={120} aria-invalid={err('name').invalid} className={inputClass} />
      </FormField>
      <FormField label={t('providerSignup.type')} error={errors.type}>
        <select name="type" defaultValue={initial?.type ?? 'homestay'} className={inputClass}>
          {ProviderGroupSchema.options.map((g) => (
            <optgroup key={g} label={t(`connect.${g}`)}>
              {PROVIDER_GROUPS[g].map((type) => <option key={type} value={type}>{t(`connect.type.${type}`)}</option>)}
            </optgroup>
          ))}
        </select>
      </FormField>
      <FormField label={t('providerSignup.destination')} error={errors.destinationSlug}>
        <select name="destinationSlug" defaultValue={initial?.destination.slug ?? destinations[0]?.slug} className={inputClass}>
          {destinations.map((d) => <option key={d.id} value={d.slug}>{d.name} · {d.province}</option>)}
        </select>
      </FormField>
      <FormField label={t('providerSignup.priceFrom')} error={errors.priceFrom}>
        <input name="priceFrom" type="number" min={0} step={1000} defaultValue={initial?.priceFrom} required aria-invalid={err('priceFrom').invalid} className={inputClass} />
      </FormField>
      <FormField label={t('providerSignup.priceUnit')} error={errors.priceUnit}>
        <select name="priceUnit" defaultValue={initial?.priceUnit ?? 'night'} className={inputClass}>
          {PriceUnitSchema.options.map((u) => <option key={u} value={u}>{t(`providerSignup.unit.${u}`)}</option>)}
        </select>
      </FormField>
      <FormField label={t('providerSignup.address')} error={errors.address} className="sm:col-span-2">
        <input name="address" defaultValue={initial?.address ?? ''} maxLength={200} className={inputClass} />
      </FormField>
      <FormField label={t('providerSignup.description')} error={errors.description} className="sm:col-span-2">
        <textarea name="description" defaultValue={initial?.description} required minLength={30} maxLength={2000} rows={4} aria-invalid={err('description').invalid} className={inputClass} />
      </FormField>
      <FormField label={t('providerSignup.languages')} error={errors.languages} className="sm:col-span-2">
        <input name="languages" defaultValue={initial?.languages.join(', ')} placeholder="vi, en" className={inputClass} />
      </FormField>
    </div>
  );
}
