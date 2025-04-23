import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(response => {
        const httpContext = context.switchToHttp();
        const httpResponse = httpContext.getResponse();

        // Nếu response có cấu trúc status
        if (response && response.status && response.status.code) {
          const { code, message, error } = response.status;
          
          // Đặt HTTP status code dựa trên code từ microservice
          httpResponse.status(code);
          
          // Nếu là status code lỗi (4xx, 5xx)
          if (code >= 400) {
            // Trả về body tương tự cấu trúc lỗi chuẩn của NestJS
            return {
              statusCode: code,
              message,
              error: error || this.getDefaultError(code),
              timestamp: response.status.timestamp
            };
          }
          
          // Nếu thành công, loại bỏ status và trả về dữ liệu
          const { status, ...data } = response;
          return {
            message: message,
            ...data,
          }
        }
        
        // Trường hợp không có cấu trúc status, trả về response nguyên bản
        return response;
      }),
    );
  }
  
  private getDefaultError(code: number): string {
    const statusMap = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };
    
    return statusMap[code] || 'Unknown Error';
  }
}