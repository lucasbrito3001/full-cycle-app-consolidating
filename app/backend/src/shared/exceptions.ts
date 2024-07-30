import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from 'src/constants/enums';
import { ZodIssue } from 'zod';

export class CustomHttpException extends HttpException {
  constructor(message: string, status: HttpStatus, public errors?: any) {
    super(message, status);
  }
}

export class InvalidInputException extends CustomHttpException {
  constructor(errors: ZodIssue[]) {
    super(ErrorMessages.InvalidInput, HttpStatus.BAD_REQUEST, errors);
  }
}

export class InternalErrorException extends CustomHttpException {
  constructor(error: any) {
    super(
      ErrorMessages.InternalServerError,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}

export class EntityNotFoundException extends CustomHttpException {
  constructor() {
    super(ErrorMessages.EntityNotFound, HttpStatus.BAD_REQUEST);
  }
}

export class UniqueKeyConstraintViolationException extends CustomHttpException {
  constructor(violatedKeys: string[]) {
    super(ErrorMessages.UniqueKeyViolation, HttpStatus.BAD_REQUEST, {
      violatedKeys,
    });
  }
}

export class InvalidCredentialsException extends CustomHttpException {
  constructor() {
    super(ErrorMessages.InvalidCredentials, HttpStatus.UNAUTHORIZED);
  }
}

export class UnauthorizedRequestException extends CustomHttpException {
  constructor() {
    super(ErrorMessages.Unauthorized, HttpStatus.UNAUTHORIZED);
  }
}
