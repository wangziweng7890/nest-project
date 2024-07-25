import { Module } from '@nestjs/common';
import { StreamDemoController } from './stream-demo.controller';

@Module({
  controllers: [StreamDemoController]
})
export class StreamDemoModule {
  
}
