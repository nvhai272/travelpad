import type { CSSProperties } from 'react';
import Image from 'next/image';

export type PolaroidProps = {
  src: string; caption: string; credit?: string;
  at: [string, string]; w: string; tilt: string; tape: 'gold' | 'red'; delay: number;
};

/**
 * Ảnh polaroid dán băng keo như trang sổ tay du lịch: khung giấy trắng, chú thích viết tay, nghiêng nhẹ, bồng bềnh.
 * Rê chuột: dựng thẳng + phóng nhẹ, hiện ghi công ảnh (title). Ảnh chỉ trang trí (alt rỗng – nơi dùng đã aria-hidden).
 */
export function Polaroid({ src, caption, credit, at: [top, left], w, tilt, tape, delay }: PolaroidProps) {
  const pos: CSSProperties = { top, left, width: w, animationDelay: `${delay}s` };
  return (
    <figure title={credit} className="pointer-events-auto absolute m-0 motion-safe:animate-decor-in" style={pos}>
      <div className={`transition-transform duration-500 ease-out hover:z-10 hover:rotate-0 hover:scale-110 ${tilt}`}>
        <div className="motion-safe:animate-decor-float" style={{ animationDelay: `${-delay * 3}s` }}>
          <div className="relative rounded-[3px] bg-card p-[7%] pb-[3%] shadow-[0_18px_30px_-14px_oklch(30%_0.04_55/0.45),0_2px_6px_oklch(30%_0.04_55/0.12)]">
            <span className={`absolute -top-2.5 left-1/2 h-5 w-[42%] -translate-x-1/2 -rotate-3 ${tape === 'gold' ? 'bg-vn-gold/50' : 'bg-accent/30'}`} />
            <Image src={src} alt="" width={320} height={240} sizes="200px" className="aspect-[4/3] w-full rounded-[2px] object-cover" />
            <figcaption className="truncate pt-[6%] text-center font-script text-[1.05rem] font-bold leading-tight text-foreground/80">{caption}</figcaption>
          </div>
        </div>
      </div>
    </figure>
  );
}
