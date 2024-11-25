import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    request.startTime = now;
    const url = request.originalUrl;
    const method = request.method;
    const params = JSON.stringify(request.params);
    const queries = JSON.stringify(request.query);
    const body = JSON.stringify(request.body);
    const headersReq = JSON.stringify(request.headers);
    const userAgent = request.get('user-agent') || '';
    const routePath = request?.route?.path;
    return next.handle().pipe(
      tap((data) => {
        const timeExecuted = Date.now() - now;
        const clientIp = request.clientIp;
        const contentLength = response.get('content-length');
        try {
          this.logger.log({
            message: 'NestLogger',
            fields: {
              info: `${method}: ${url} - ${response.statusCode} - ${timeExecuted}ms`,
              method,
              userAgent,
              clientIp,
              contentLength,
              url,
              routePath,
              body,
              queries,
              params,
              headers: headersReq,
              status: response.statusCode,
              timeExecuted,
              unitTime: 'ms',
              res: typeof data === 'object' ? JSON.stringify(data || {}) : data,
            },
          });
        } catch (ex) {
          console.error(ex);
        }
      }),
    );
  }
}
