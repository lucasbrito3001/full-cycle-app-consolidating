import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CustomHttpException } from '../shared/exceptions';

@Catch(CustomHttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('CustomHttpExceptionFilter');

  catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.error(
      `${exception.message} ${
        exception.errors
          ? `- ${
              typeof exception.errors === 'object'
                ? JSON.stringify(exception.errors)
                : exception.errors
            }`
          : ''
      }`,
    );

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      ...(status !== 500 && { errors: exception.errors }),
    });
  }
}
