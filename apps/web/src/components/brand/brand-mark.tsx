import { SITE_NAME } from '@/lib/site';
import { NonLaAccent } from './brand-glyphs';
import { LacBird } from './lac-bird';

/** Biểu tượng vuông: chim Lạc vàng trên nền xanh lúa (dùng riêng cho icon app, ảnh đại diện). */
export function BrandBadge({ className = 'size-[1.55em]' }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-[22%] bg-primary text-vn-gold ${className}`}>
      <LacBird className="w-[82%]" />
    </span>
  );
}

/**
 * Logo một hàng, cả ba phần đứng chung đường chân chữ: "TravelPad" (Lora, xanh lá) · chim Lạc (vàng đồng) đậu trên
 * đường chân chữ, mỏ vươn chéo lên chỉ vào chiếc nón · "Vi[ệ đội nón lá]t Nam" (Dancing Script, đỏ cờ, nghiêng nhẹ
 * như nét ký tay). Nón cùng màu chim để hai hình gắn với nhau. Trình đọc màn hình đọc "TravelPad Việt Nam".
 * `tagline`: khẩu hiệu hiện ngay dưới logo.
 */
export function BrandLockup({ size = 'md', tagline }: { size?: 'sm' | 'md'; tagline?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${size === 'sm' ? 'text-2xl' : 'text-[1.2rem] sm:text-[1.6rem] lg:text-[1.85rem]'}`}>
      <span role="img" aria-label={`${SITE_NAME} Việt Nam`} className="inline-flex items-baseline pt-[0.2em]">
        <span aria-hidden className="font-display text-[0.72em] font-semibold tracking-[-0.01em] text-primary">{SITE_NAME}</span>
        <LacBird className="-mr-[0.34em] ml-[0.08em] h-[1.2em] w-auto shrink-0 text-vn-gold-deep" />
        <span aria-hidden className="inline-block origin-bottom-left -rotate-[4deg] font-script text-[1.3em] font-bold text-vn-red">
          Vi
          <span className="relative">
            ẹ
            <NonLaAccent className="absolute top-[0.3em] left-[0.07em] w-[0.4em] text-vn-gold-deep" />
          </span>
          t Nam
        </span>
      </span>
      {tagline && <BrandTagline text={tagline} />}
    </span>
  );
}

/** Khẩu hiệu dưới logo như dải ruy băng: đường kẻ vàng đồng – chữ Lora nghiêng – đường kẻ, hai đầu có hạt tròn. */
function BrandTagline({ text }: { text: string }) {
  const rule = 'relative h-px min-w-[1.2em] flex-1 bg-vn-gold-deep/70';
  return (
    <span className="mt-[0.3em] flex items-center gap-[0.45em] font-display text-[max(10px,0.44em)] font-medium italic text-primary/85">
      <span className={`${rule} after:absolute after:left-0 after:top-1/2 after:size-[0.35em] after:-translate-y-1/2 after:rounded-full after:bg-vn-gold-deep`} />
      {text}
      <span className={`${rule} after:absolute after:right-0 after:top-1/2 after:size-[0.35em] after:-translate-y-1/2 after:rounded-full after:bg-vn-gold-deep`} />
    </span>
  );
}
