import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import logger from 'src/infrastructure/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query, params } = req;
    const now = Date.now();

    logger.info(`Request: ${method} ${originalUrl}`, {
      method,
      url: originalUrl,
      body,
      query,
      params,
    });

    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        logger.info(`Response: ${method} ${originalUrl} ${res.statusCode} +${Date.now() - now}ms`, {
          method,
          url: originalUrl,
          statusCode: res.statusCode,
          duration: Date.now() - now,
          response: data,
        });
      }),
      catchError((err) => {
        const res = context.switchToHttp().getResponse();
        logger.error(`Error: ${method} ${originalUrl} ${res.statusCode} +${Date.now() - now}ms`, {
          method,
          url: originalUrl,
          statusCode: res.statusCode,
          duration: Date.now() - now,
          error: err.message,
          stack: err.stack,
        });
        throw err;
      })
    );
  }
} 