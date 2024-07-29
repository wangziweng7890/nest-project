import { Injectable, Inject, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { STS } from 'ali-oss';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as path from "path";
type ReturnCredentials = {
  accessKeyId: string
  accessKeySecret: string,
  stsToken: string,
  region: string,
  bucket: string
}

type OssModuleOptions = {
  accessKeyId: string
  accessKeySecret: string
  roleArn: string
  bucket: string
  region: string
}

@Injectable()
export class OssService implements OnModuleInit {
  @Inject(ConfigService)
  private readonly ConfigService: ConfigService
  private Client: OSS
  private StsClient: STS
  private ossCredentials: ReturnCredentials

  async onModuleInit() {
    const options = this.ConfigService.get<OssModuleOptions>('oss')
    this.StsClient = new STS({
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret
    })
    this.Client = new OSS({
      region: options.region,
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
      bucket: options.bucket,
    })
    await this.fetchCredentials()
  }

  // assumeRole方法阿里有并发限制，因此用定时任务来定时获取
  @Interval(1000 * 2900)
  private async fetchCredentials() {
    const options = this.ConfigService.get<OssModuleOptions>('oss')
    // roleArn填写步骤2获取的角色ARN，例如acs:ram::175708322470****:role/ramtest。
    // policy填写自定义权限策略，用于进一步限制STS临时访问凭证的权限。如果不指定Policy，则返回的STS临时访问凭证默认拥有指定角色的所有权限。
    // 3000为过期时间，单位为秒。
    // sessionName用于自定义角色会话名称，用来区分不同的令牌，例如填写为sessiontest。
    const result = await this.StsClient.assumeRole(options.roleArn, ``, 3000, 'sessiontest')
    this.ossCredentials = {
      accessKeyId: result.credentials.AccessKeyId,
      accessKeySecret: result.credentials.AccessKeySecret,
      stsToken: result.credentials.SecurityToken,
      region: options.region,
      bucket: options.bucket,
    }
  }

  /**
   * 获取临时凭证
   */
  async getStsToken() {
    if (this.ossCredentials) return this.ossCredentials
    await this.fetchCredentials()
    return this.ossCredentials
  }

  /**
   * 获取可访问链接
  */
  async getPublicUrl(ossPath: string) {
    const signUrl = this.Client.signatureUrl(ossPath, {
      expires: 24 * 60 * 60,
    });
    return signUrl
  }

  /**
   * 图片处理
   */
  async getProcessUrl(ossPath: string, process: string) {
    const signUrl = this.Client.signatureUrl(ossPath, {
      process,
      expires: 24 * 60 * 60,
    });
    return signUrl
  }

  // 图片上传示例
  async multipartUpload() {
    try {
      const result = await this.Client.multipartUpload('exampledir/package.json',
        path.normalize(path.join(process.cwd(), 'package.json')),
        {});
      console.log(result);
    } catch (e) {
      // 捕获超时异常。
      if (e.code === 'ConnectionTimeoutError') {
        console.log('TimeoutError');
        // do ConnectionTimeoutError operation
      }
      console.log(e);
      throw new HttpException(e.message, HttpStatus.REQUEST_TIMEOUT)
    }
  }
}
