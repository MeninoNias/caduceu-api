import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AnyObjectSchema, InferType } from 'yup';

@Injectable()
export class YupValidationPipe<T extends AnyObjectSchema> implements PipeTransform {
  constructor(private schema: T) { }

  async transform(value: InferType<T>): Promise<InferType<T>> {
    try {
      return await this.schema.validate(value, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.errors,
      });
    }
  }
}