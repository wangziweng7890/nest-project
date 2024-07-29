import { Controller, Get, Query } from '@nestjs/common';
import { OssService } from './oss.service';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Get('sts_token')
  getStsToken() {
    return this.ossService.getStsToken();
  }
  @Get('public_url')
  getPublicUrl(@Query('url') url: string) {
    return this.ossService.getPublicUrl(url);
  }
  @Get('process_url')
  getProcessUrl(@Query('url') url: string, @Query('process') process: string) {
    return this.ossService.getProcessUrl(url, process);
  }
  @Get('upload')
  upload() {
    return this.ossService.multipartUpload();
  }
}
