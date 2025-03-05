import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';

export type ErrorResponse = {
  error: {
    code: number;
    message: string;
  };
};

export type SuccessResponse<T = Record<string, any>> = {
  data: T;
};

export type APIResponse<T> = ErrorResponse | SuccessResponse<T>;

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, APIResponse<T>>
{
  constructor() {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<APIResponse<T>> {
    return next.handle().pipe(
      map((res: T) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    // const request: Request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      error: {
        code: status,
        message: exception.message,
      },
    });
  }

  responseHandler(res: T, context: ExecutionContext): SuccessResponse<T> {
    // const ctx = context.switchToHttp();
    // const response: Response = ctx.getResponse();
    // const statusCode= response.statusCode;

    return {
      data: {
        ...res,
      },
    };
  }
}
