import { Children, type ReactNode } from 'react';

/**
 * Điện thoại: băng chuyền vuốt ngang (snap, lộ một phần thẻ sau để gợi ý vuốt) – giảm chiều dài trang.
 * Từ `sm` trở lên: lưới bình thường theo `gridClass`.
 */
export function ScrollRow({ children, gridClass = 'sm:grid-cols-2 lg:grid-cols-3', itemClass = 'w-[82%]' }: { children: ReactNode; gridClass?: string; itemClass?: string }) {
  return (
    <div className={`no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 ${gridClass}`}>
      {Children.map(children, (child) => child && <div className={`${itemClass} shrink-0 snap-start sm:w-auto`}>{child}</div>)}
    </div>
  );
}
