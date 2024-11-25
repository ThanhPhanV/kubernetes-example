import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserClientModule } from './shared_modules/user-client/user-client.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'interceptors/logging.interceptor';
import { CatchEverythingFilter } from 'filters/catch-all-exception.filter';
import { WinstonModule } from 'nest-winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { apm } from './configs/apm';
@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          transports: [
            new ElasticsearchTransport({
              indexPrefix: 'back-end-log',
              indexSuffixPattern: 'YYYY-MM-DD',
              apm: apm,
              transformer: (logData) => {
                console.log(Math.random() * 100);
                const formatted = {
                  '@timestamp': new Date(),
                  severity: logData.level,
                  stack: logData.meta.stack,
                  fields: {
                    body: JSON.stringify(logData?.meta?.fields?.body || '{}'),
                    res: JSON.stringify(logData?.meta?.fields?.res || '{}'),
                    url: logData?.meta?.fields?.url || '',
                    params: JSON.stringify(
                      logData?.meta?.fields?.params || '{}',
                    ),
                    headers: JSON.stringify(
                      logData?.meta?.fields?.headers || '{}',
                    ),
                    status: logData?.meta?.fields?.status || '',
                    method: logData?.meta?.fields?.method || '',
                    timeExecuted: logData?.meta?.fields?.timeExecuted || '',
                  },
                  message: logData?.message || '',
                };
                return formatted;
              },
              clientOpts: {
                node: config.get('ES_END_POINT'),
                maxRetries: 5,
                requestTimeout: 10000,
                sniffOnStart: false,
                auth: {
                  apiKey: config.get('ES_API_KEY'),
                },
              },
            }),
          ],
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UserClientModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule {}
