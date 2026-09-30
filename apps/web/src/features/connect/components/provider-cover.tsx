import type { LucideIcon } from 'lucide-react';
import { BedDouble, Bike, Bus, Car, Coffee, Compass, Hotel, House, Map, TreePalm, UtensilsCrossed } from 'lucide-react';
import type { ProviderType } from '@travelpad/contracts';
import { DongSonPattern } from '@/components/brand/dong-son-pattern';

const ICON: Record<ProviderType, LucideIcon> = {
  hotel: Hotel, guesthouse: BedDouble, homestay: House, resort: TreePalm, restaurant: UtensilsCrossed, cafe: Coffee,
  tour_guide: Compass, tour_operator: Map, car_rental: Car, motorbike_rental: Bike, shuttle: Bus,
};

/**
 * Ảnh bìa nhà cung cấp. Chưa có ảnh riêng (nhà cung cấp tự tải lên – TL-718) thì hiện ô thiết kế theo loại dịch vụ,
 * KHÔNG mượn ảnh điểm đến – tránh để người xem tưởng đó là ảnh thật của cơ sở.
 */
export function ProviderCover({ src, type, className = '', iconClass = 'size-10' }: { src: string | null; type: ProviderType; className?: string; iconClass?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  }
  const Icon = ICON[type];
  return (
    <div className={`relative grid h-full w-full place-items-center overflow-hidden bg-primary/10 text-primary ${className}`}>
      <DongSonPattern className="absolute -right-1/4 -top-1/3 w-[120%] text-primary/10" />
      <Icon className={`relative ${iconClass}`} strokeWidth={1.5} />
    </div>
  );
}
