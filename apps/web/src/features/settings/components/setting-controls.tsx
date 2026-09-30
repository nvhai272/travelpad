'use client';

import type { LucideIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

/** Khối điều khiển dùng trong bảng Cài đặt: nhóm có icon, dòng bật/tắt, lựa chọn phân đoạn. */
export function SettingGroup({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-background/60 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" /> {title}
      </h3>
      {children}
    </section>
  );
}

export function SettingSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-4 border-t border-border pt-3 first:mt-0 first:border-t-0 first:pt-0">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
            value === o.value ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
