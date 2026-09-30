/** Quốc kỳ Việt Nam (đúng tỉ lệ 2:3, màu chuẩn). Chỉ dùng ở chỗ mang nghĩa quốc gia: chọn ngôn ngữ, "Làm tại Việt Nam" – không làm họa tiết trang trí. */
export function VnFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" role="img" aria-label="Việt Nam" className={className}>
      <rect width="30" height="20" rx="2" fill="#DA251D" />
      <polygon fill="#FFFF00" points="15,4 16.41,8.06 20.71,8.15 17.28,10.74 18.53,14.85 15,12.4 11.47,14.85 12.72,10.74 9.29,8.15 13.59,8.06" />
    </svg>
  );
}
