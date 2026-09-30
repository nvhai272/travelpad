import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import type { ApiError } from '@travelpad/contracts';

/** Chuẩn hoá mọi lỗi về dạng ApiError { statusCode, code, message, details }. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    let body: ApiError = { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, code: 'INTERNAL', message: 'Internal server error' };

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const r = exception.getResponse();
      const obj = typeof r === 'string' ? { message: r } : (r as Record<string, unknown>);
      body = {
        statusCode: status,
        code: (obj.code as string) ?? HttpStatus[status] ?? 'ERROR',
        message: (obj.message as string) ?? exception.message,
        details: obj.details,
      };
    } else {
      this.logger.error(exception);
    }
    res.status(body.statusCode).json(body);
  }
}
