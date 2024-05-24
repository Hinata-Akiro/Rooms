import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: any) => {
        this.safeErrorHandler(err, context);
        return throwError(() => err);
      }),
    );
  }

  private safeErrorHandler(
    exception: HttpException,
    context: ExecutionContext,
  ): void {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (response.headersSent) {
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse() as
      | { message: string | string[] }
      | { error: string; statusCode: number; message: string | string[] }
      | string;

    let message: string | string[];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if ('message' in exceptionResponse) {
      message = exceptionResponse.message;
    } else {
      message = 'An unexpected error occurred';
    }
    response.status(status).json({
      status: false,
      path: request.url,
      statusCode: status,
      message,
      name: exception.name,
    });
  }

  private responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (res && res.hasOwnProperty('status') && res.hasOwnProperty('result')) {
      return res;
    }

    return {
      status: true,
      path: request.url,
      statusCode: HttpStatus.OK,
      result: res,
    };
  }
}
