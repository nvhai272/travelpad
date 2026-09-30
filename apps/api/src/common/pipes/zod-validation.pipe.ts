import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

/** Validate body/query bằng schema trong @travelpad/contracts – cùng schema với frontend. */
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({ code: 'VALIDATION_FAILED', message: 'Thông tin chưa hợp lệ, bạn kiểm tra lại nhé', details: result.error.issues });
    }
    return result.data;
  }
}
