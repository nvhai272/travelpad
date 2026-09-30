'use client';

/** Chip chọn lọc (bật/tắt). */
export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-2 text-xs transition lg:px-3 lg:py-1.5 ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-secondary'}`}>
      {children}
    </button>
  );
}

/** Nhóm chip có nhãn (VD "Khu vực", "Loại địa điểm"). */
export function ChipGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
