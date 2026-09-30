import type { Region } from '@travelpad/contracts';

/**
 * Chủ đề văn hóa (trang /culture). Chữ nằm ở packages/i18n (`culture.topics.<key>`); ở đây chỉ giữ ảnh, nhóm và
 * liên kết sang địa điểm / điểm đến có thật trong dữ liệu để người đọc đi tiếp từ "hiểu" sang "trải nghiệm".
 */
export type CultureGroup = 'symbols' | 'heritage' | 'life' | 'cuisine';
export type CultureKey =
  | 'nonLa' | 'aoDai' | 'trongDong' | 'hoaSen' | 'haLong' | 'hoiAn' | 'vanMieu' | 'hue'
  | 'muaRoiNuoc' | 'choNoi' | 'pho' | 'banhMi' | 'caPhe';

export type CultureTopic = {
  slug: string; key: CultureKey; group: CultureGroup; image: string;
  /** Địa điểm (spot) liên quan – slug có trong DB */
  places: string[];
  /** Đi tiếp: điểm đến (slug destination) hoặc cả miền */
  destination?: string; region?: Region;
};

export const CULTURE_GROUPS: CultureGroup[] = ['symbols', 'heritage', 'life', 'cuisine'];

export const CULTURE_TOPICS: CultureTopic[] = [
  { slug: 'non-la', key: 'nonLa', group: 'symbols', image: '/images/culture/non-la.jpg', places: [], region: 'central' },
  { slug: 'ao-dai', key: 'aoDai', group: 'symbols', image: '/images/culture/ao-dai.jpg', places: [] },
  { slug: 'trong-dong', key: 'trongDong', group: 'symbols', image: '/images/culture/trong-dong.jpg', places: [], destination: 'ha-noi' },
  { slug: 'hoa-sen', key: 'hoaSen', group: 'symbols', image: '/images/culture/hoa-sen.jpg', places: [], destination: 'ha-noi' },
  { slug: 'vinh-ha-long', key: 'haLong', group: 'heritage', image: '/images/places/lm-ha-long.jpg', places: ['du-thuyen-vinh-ha-long', 'dao-ti-top', 'cha-muc-ha-long'], destination: 'ha-long' },
  { slug: 'pho-co-hoi-an', key: 'hoiAn', group: 'heritage', image: '/images/places/lm-hoi-an.jpg', places: [], region: 'central' },
  { slug: 'van-mieu', key: 'vanMieu', group: 'heritage', image: '/images/places/lm-khue-van-cac.jpg', places: ['ho-hoan-kiem'], destination: 'ha-noi' },
  { slug: 'co-do-hue', key: 'hue', group: 'heritage', image: '/images/culture/co-do-hue.jpg', places: [], region: 'central' },
  { slug: 'mua-roi-nuoc', key: 'muaRoiNuoc', group: 'life', image: '/images/culture/mua-roi-nuoc.jpg', places: ['ho-hoan-kiem'], destination: 'ha-noi' },
  { slug: 'cho-noi', key: 'choNoi', group: 'life', image: '/images/places/lm-cai-rang.jpg', places: [], region: 'south' },
  { slug: 'pho', key: 'pho', group: 'cuisine', image: '/images/places/pho-bat-dan.jpg', places: ['pho-bat-dan'], destination: 'ha-noi' },
  { slug: 'banh-mi', key: 'banhMi', group: 'cuisine', image: '/images/culture/banh-mi.jpg', places: ['cho-ben-thanh', 'pho-am-thuc-vinh-khanh'], destination: 'tp-hcm' },
  { slug: 'ca-phe', key: 'caPhe', group: 'cuisine', image: '/images/places/ca-phe-trung-pho-co.jpg', places: ['ca-phe-trung-pho-co', 'ca-phe-doi-thong'], destination: 'da-lat' },
];

/** Chủ đề nổi bật cho khối giới thiệu ở trang chủ – trộn đủ bốn nhóm. */
export const HOME_CULTURE = ['trong-dong', 'vinh-ha-long', 'mua-roi-nuoc', 'pho', 'non-la', 'pho-co-hoi-an'];

export const topicBySlug = (slug: string) => CULTURE_TOPICS.find((t) => t.slug === slug);
