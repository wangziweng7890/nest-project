import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { StreamableFile } from '@nestjs/common';
// 普通返回类型
type NormalDataType = {
  message: string
  statusCode: HttpStatus
  data?: string | number | Array<any> | Record<string, any>
}
// 流式返回类型
type StreamType = StreamableFile

type ResponseType = NormalDataType | StreamType
// 同理我们还可以加上graphql等类型，然后针对不同类型定义响应结果

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseType> {
    return next.handle().pipe(map(data => {
      if (data instanceof StreamableFile) return data
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data
      }
    }))
  }
}
