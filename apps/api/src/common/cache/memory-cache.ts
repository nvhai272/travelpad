import { Injectable } from '@nestjs/common';

/**
 * Cache bộ nhớ đơn giản theo key + TTL cho các truy vấn tổng hợp đắt (BXH…).
 * Thay bằng Redis khi chạy nhiều instance API.
 */
@Injectable()
export class MemoryCache {
  private readonly store = new Map<string, { at: number; value: unknown }>();

  async getOrSet<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
    const hit = this.store.get(key);
    if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
    const value = await load();
    this.store.set(key, { at: Date.now(), value });
    return value;
  }
}
