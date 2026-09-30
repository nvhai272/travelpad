/** So khớp không dấu: "da lat", "Đà Lạt", "lam dong" đều khớp Đà Lạt (BR-MAP-05). */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
