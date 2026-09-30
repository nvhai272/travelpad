import { getTranslations } from 'next-intl/server';
import { creditFor } from '@/lib/photo-credits';
import { Polaroid, type PolaroidProps } from './polaroid';

/**
 * Ảnh polaroid địa danh – món ăn ở hai lề màn hình rất rộng (≥1560px), như trang sổ tay du lịch dán ảnh:
 * lề trái miền Bắc, lề phải miền Trung – Nam. Nằm trong lề ngoài khung nội dung 1480px (+ đệm 40px) nên không đè nội dung;
 * điện thoại/laptop không hiện. Ảnh thật từ public/images (đã ghi công ở lib/photo-credits.ts, trang /credits).
 */
const RAIL = 'pointer-events-none fixed inset-y-0 -z-10 hidden w-[calc((100vw-1480px)/2+40px)] justify-center pb-4 pt-24 min-[1560px]:flex';

type Slot = Omit<PolaroidProps, 'caption' | 'credit' | 'src' | 'delay'> & { photo: string; key: string };
const LEFT: Slot[] = [
  { key: 'khueVanCac', photo: 'lm-khue-van-cac', at: ['0%', '8%'], w: '64%', tilt: '-rotate-6', tape: 'gold' },
  { key: 'hoanKiem', photo: 'ho-hoan-kiem', at: ['18%', '34%'], w: '58%', tilt: 'rotate-4', tape: 'red' },
  { key: 'haLong', photo: 'lm-ha-long', at: ['37%', '4%'], w: '66%', tilt: '-rotate-3', tape: 'gold' },
  { key: 'muCangChai', photo: 'lm-mu-cang-chai', at: ['56%', '32%'], w: '60%', tilt: 'rotate-6', tape: 'red' },
  { key: 'pho', photo: 'pho-bat-dan', at: ['75%', '10%'], w: '56%', tilt: '-rotate-4', tape: 'gold' },
];
const RIGHT: Slot[] = [
  { key: 'hoiAn', photo: 'lm-hoi-an', at: ['0%', '28%'], w: '64%', tilt: 'rotate-5', tape: 'red' },
  { key: 'cauVang', photo: 'lm-golden-bridge', at: ['18%', '4%'], w: '62%', tilt: '-rotate-4', tape: 'gold' },
  { key: 'miQuang', photo: 'mi-quang-ba-mua', at: ['37%', '34%'], w: '56%', tilt: 'rotate-3', tape: 'red' },
  { key: 'benThanh', photo: 'cho-ben-thanh', at: ['56%', '6%'], w: '62%', tilt: '-rotate-6', tape: 'gold' },
  { key: 'caiRang', photo: 'lm-cai-rang', at: ['75%', '30%'], w: '62%', tilt: 'rotate-4', tape: 'red' },
];

/** Đường chấm uốn lượn nối các ảnh như lộ trình vẽ tay + quầng sáng ấm phía sau. */
function Route({ path }: { path: string }) {
  return (
    <>
      <div className="absolute left-[5%] top-[18%] size-44 rounded-full bg-vn-gold/15 blur-3xl" />
      <div className="absolute bottom-[14%] right-[5%] size-44 rounded-full bg-accent/10 blur-3xl" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full text-vn-gold-deep/45">
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </>
  );
}

export async function SideDecor() {
  const t = await getTranslations();
  const rail = (slots: Slot[], side: string, path: string, start: number) => (
    <div aria-hidden className={`${RAIL} ${side}`}>
      <div className="relative h-full w-full max-w-[15rem]">
        <Route path={path} />
        {slots.map(({ key, photo, ...s }, i) => {
          const src = `/images/places/${photo}.jpg`;
          const c = creditFor(src);
          return (
            <Polaroid key={key} {...s} src={src} delay={start + i * 0.15}
              caption={t(`decor.${key}` as 'decor.pho')} credit={c && t('common.photoBy', { artist: c.artist, license: c.license })} />
          );
        })}
      </div>
    </div>
  );
  return (
    <>
      {rail(LEFT, 'left-0', 'M40 8C80 16 70 26 44 34S20 50 60 58 80 72 40 82', 0.1)}
      {rail(RIGHT, 'right-0', 'M60 8C20 16 30 26 56 34S80 50 40 58 20 72 60 82', 0.2)}
    </>
  );
}
