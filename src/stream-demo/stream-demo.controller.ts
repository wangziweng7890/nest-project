import { Controller, StreamableFile, Get } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
@Controller('stream-demo')
export class StreamDemoController {
    @Get('file')  
    getFile(): StreamableFile {
      const file = createReadStream(join(process.cwd(), 'src/main.ts'));
      return new StreamableFile(file);
    }
}
