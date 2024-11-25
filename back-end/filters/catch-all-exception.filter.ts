import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest();

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request?.url,
      response:
        (exception as any)?.response?.data ||
        (exception as any)?.response ||
        (exception as any).message,
    };

    this.logger.log({
      message: 'server - error',
      fields: {
        url: responseBody?.path,
        method: request?.method?.toUpperCase(),
        status: (exception as any)?.response?.status,
        res: responseBody.response,
        headers: request?.headers,
        body: request?.body,
      },
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
