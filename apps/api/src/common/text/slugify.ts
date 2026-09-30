/** "Nhà nghỉ Mây Trắng" → "nha-nghi-may-trang" (bỏ dấu tiếng Việt, đ → d). */
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
