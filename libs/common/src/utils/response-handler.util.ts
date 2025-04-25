import { HttpException, HttpStatus } from '@nestjs/common';

export interface MicroserviceResponseResult<T> {
  data: T;
  message: string;
}

export function handleMicroserviceResponse<T>(
  response: {
    status?: {
      code?: number;
      message?: string;
      error?: any;
    };
    data?: T;
  },
  options: {
    allowEmptyData?: boolean;
    throwOnNoData?: boolean;
  } = { allowEmptyData: false, throwOnNoData: true }
): MicroserviceResponseResult<T> {
  // Check if status exists
  if (!response || !response.status) {
    throw new HttpException(
      'Invalid response from microservice',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
  
  // Check status code
  if (response.status.code !== 200) {
    throw new HttpException(
      response.status.message || 'Error from microservice',
      response.status.code || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
  
  // Check if data exists when required
  // if (options.throwOnNoData && !options.allowEmptyData) {
  //   throw new HttpException(
  //     'Data is undefined in microservice response',
  //     HttpStatus.INTERNAL_SERVER_ERROR
  //   );
  // }
  
  return {
    data: response.data as T,
    message: response.status.message || 'Operation successful'
  };
}

/**
 * Convert HTTP status code to appropriate HttpStatus enum
 */
export function mapStatusCode(code: number): HttpStatus {
  if (code >= 100 && code < 600) {
    return code as HttpStatus;
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}