import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { InvalidInputException } from 'src/shared/exceptions';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const parseResult = this.schema.safeParse(value);

    if (!parseResult.success)
      throw new InvalidInputException(parseResult.error.issues);

    return parseResult.data;
  }
}
