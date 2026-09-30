import type { ReactNode } from 'react';
import { PhotoCredit } from './photo-credit';

type Props = {
  image: string | null;
  imageAlt: string;
  eyebrow: ReactNode;
  title: string;
  /** Trang chi tiết dùng h1; hero trang chủ dùng h2 (h1 là câu giới thiệu sản phẩm). */
  as?: 'h1' | 'h2';
  lead?: ReactNode;
  /** Nút góc phải trên (VD lưu) */
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Thêm class cho ảnh nền (VD lật ngang để chủ thể không bị chữ đè) */
  imageClassName?: string;
  /** Ghi đè độ rộng câu dẫn (mặc định max-w-xl) */
  leadClassName?: string;
  /** lg: tiêu đề lớn hơn cho hero trang chủ · sm: tiêu đề dài, thu nhỏ trên điện thoại để gọn 2 dòng */
  size?: 'sm' | 'md' | 'lg';
};

/** Ảnh lớn phong cách tạp chí: gradient tối dần, eyebrow có gạch, tiêu đề serif, câu dẫn. */
export function EditorialHero({ image, imageAlt, eyebrow, title, as: Heading = 'h1', lead, action, children, className = 'min-h-[340px] sm:min-h-[420px]', imageClassName = '', leadClassName = 'max-w-xl', size = 'md' }: Props) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl shadow-editorial ${image ? 'bg-card' : 'bg-primary'} ${className}`}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={imageAlt} fetchPriority="high" className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02] ${imageClassName}`} />
      )}
      <div className="bg-hero-overlay absolute inset-0" />
      <div className="hero-copy absolute inset-x-0 bottom-0 z-10 p-5 sm:p-9">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
          <span className="h-px w-8 bg-accent" /> {eyebrow}
        </div>
        <Heading className={`max-w-xl font-display font-medium leading-[1.02] sm:text-5xl ${size === 'sm' ? 'text-[2rem]' : 'text-4xl'} ${size === 'lg' ? 'lg:text-7xl' : 'lg:text-6xl'}`}>{title}</Heading>
        {lead && <p className={`mt-3 line-clamp-3 ${leadClassName} text-sm leading-6 sm:line-clamp-none sm:text-base`}>{lead}</p>}
        {children}
      </div>
      {action && <div className="absolute right-5 top-5 z-10">{action}</div>}
      <PhotoCredit src={image} className="absolute bottom-2 right-2 z-20" />
    </div>
  );
}
