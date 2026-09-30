/**
 * Đọc nhãn "mùa đẹp nhất" (VD "Tháng 9 – 11", "Tháng 11 – 4" vắt qua năm, "Tháng 5") thành danh sách tháng 1–12.
 * Dùng cho mục "Đang vào mùa" (BR-HOME-06) – web và mobile dùng chung.
 */
export function seasonMonths(label: string | null | undefined): number[] {
  if (!label) return [];
  const nums = (label.match(/\d{1,2}/g) ?? []).map(Number).filter((m) => m >= 1 && m <= 12);
  if (nums.length === 0) return /quanh năm|all year/i.test(label) ? Array.from({ length: 12 }, (_, i) => i + 1) : [];
  const [from, to = from] = nums as [number, number?];
  const months: number[] = [];
  for (let m = from; ; m = (m % 12) + 1) {
    months.push(m);
    if (m === to || months.length === 12) return months;
  }
}

export const inSeason = (label: string | null | undefined, month: number) => seasonMonths(label).includes(month);
