import type { Paginated } from '@travelpad/contracts';

/** Truy vấn lấy `limit + 1` bản ghi; hàm này cắt về `limit` và tính nextCursor. */
export function toPage<Row extends { id: string }, Item>(rows: Row[], limit: number, map: (row: Row) => Item): Paginated<Item> {
  const hasMore = rows.length > limit;
  const page = rows.slice(0, limit);
  return { items: page.map(map), nextCursor: hasMore ? page.at(-1)!.id : null };
}

/** Tham số Prisma cho phân trang cursor. */
export const cursorArgs = (cursor: string | undefined, limit: number) => ({
  take: limit + 1,
  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
});
