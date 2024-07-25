import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // 转换属性，
    whitelist: true, // 去除未声明的属性
  }
  ));
  await app.listen(3000);
}
bootstrap();
