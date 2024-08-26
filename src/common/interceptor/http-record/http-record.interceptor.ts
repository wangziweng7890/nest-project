import { Inject, LoggerService, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Response } from 'express';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { StreamableFile } from '@nestjs/common';

@Injectable()
export class HttpRecordInterceptor implements NestInterceptor {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    this.logger.log('请求参数', {
      url: request.url,
      method: request.method,
      body: request.body,
      query: request.query,
      params: request.params
    })
    return next.handle().pipe(
      tap((res: Response) => {
        if (res instanceof StreamableFile) return
        this.logger.log('响应参数', {
          response: res,
          statusCode: response.statusCode
        })
      })
    )
  }
}
