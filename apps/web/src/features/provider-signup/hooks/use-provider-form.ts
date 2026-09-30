'use client';

import { useState } from 'react';
import { ApiClientError } from '@travelpad/api-client';
import { RegisterProviderSchema, type RegisterProviderInput } from '@travelpad/contracts';

const optional = (v: FormDataEntryValue | null) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

/** FormData → dữ liệu đăng ký (chuỗi rỗng → không gửi; ngôn ngữ tách theo dấu phẩy). */
function readForm(form: HTMLFormElement) {
  const f = new FormData(form);
  return {
    name: f.get('name'), type: f.get('type'), destinationSlug: f.get('destinationSlug'), address: optional(f.get('address')),
    description: f.get('description'), priceFrom: f.get('priceFrom'), priceUnit: f.get('priceUnit'),
    languages: String(f.get('languages') ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
    phone: f.get('phone'), zalo: optional(f.get('zalo')), website: optional(f.get('website')),
    licenseNumber: f.get('licenseNumber'), acceptTerms: f.get('acceptTerms') === 'on',
  };
}

/**
 * Kiểm tra bằng cùng schema với API (contracts), gom lỗi theo tên trường, gọi `save` khi hợp lệ.
 * `messageFor(field)` trả câu báo lỗi đã dịch cho từng trường (không dùng thông điệp mặc định của zod).
 */
export function useProviderForm(save: (input: RegisterProviderInput) => Promise<void>, messageFor: (field: string) => string) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(form: HTMLFormElement) {
    const parsed = RegisterProviderSchema.safeParse(readForm(form));
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), messageFor(String(i.path[0]))])));
      setFormError('invalid');
      return;
    }
    setErrors({});
    setFormError(null);
    setSaving(true);
    try {
      await save(parsed.data);
    } catch (e) {
      setFormError(e instanceof ApiClientError ? e.error.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  return { errors, formError, saving, submit };
}
