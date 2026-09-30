/** Nét vẽ của logo (dùng trong brand-mark.tsx) – tô bằng currentColor. */

/** Nón lá thay dấu mũ của chữ "Ệ" (quai là nét cong dưới vành). */
export function NonLaAccent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 13" aria-hidden className={`fill-current ${className ?? ''}`}>
      <path d="M12 .8 23 9.6Q12 12.6 1 9.6Z" />
    </svg>
  );
}
