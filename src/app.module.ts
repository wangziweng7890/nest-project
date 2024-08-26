import { Module, Logger, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './base/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseFormatInterceptor } from './common/interceptor/response-format/response-format.interceptor';
import { HttpRecordInterceptor } from './common/interceptor/http-record/http-record.interceptor';
import { StreamDemoModule } from './stream-demo/stream-demo.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { OssModule } from './base/oss/oss.module';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import * as rTracer from 'cls-rtracer';
import { WinstonModule, utilities  } from 'nest-winston';
import * as winston from 'winston';
import consoleTrace from './utils/log/console-trace';
import context2String from './utils/log/context-2-string';
import consoleReport from './utils/log/console-report';

const isDev = !process.env.npm_lifecycle_script.includes('nest start');
const combine = [winston.format.timestamp(), winston.format.ms(), consoleTrace(), context2String()]
isDev && combine.push(...[utilities.format.nestLike('MyApp', {
  colors: true,
  prettyPrint: true,
  processId: true,
  appName: true,
})])
!isDev && combine.push(consoleReport())
@Module({
  imports: [
    AuthModule, 
    StreamDemoModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    WinstonModule.forRoot({
      transports: [new winston.transports.Console({
        format: winston.format.combine(
            ...combine
          ),
      })],
    }),
    ScheduleModule.forRoot(), // 定时任务
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    OssModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatInterceptor,
    }, 
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpRecordInterceptor,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(rTracer.expressMiddleware({
        echoHeader: true, // 自动给响应头加上x-request-id
      })).forRoutes('*');
  }
}
