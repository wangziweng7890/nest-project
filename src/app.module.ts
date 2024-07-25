import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './base/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseFormatInterceptor } from './common/interceptor/response-format/response-format.interceptor';
import { StreamDemoModule } from './stream-demo/stream-demo.module';
@Module({
  imports: [AuthModule, StreamDemoModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatInterceptor,
    }
  ],
})
export class AppModule {}
