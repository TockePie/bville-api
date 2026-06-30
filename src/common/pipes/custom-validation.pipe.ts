import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Optional,
  ValidationPipe
} from '@nestjs/common'
import { type ValidationPipeOptions } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { DTO_ERROR_METADATA_KEY } from '../decorators/dto-error.decorator'

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(
    private readonly reflector: Reflector,
    @Optional() options?: ValidationPipeOptions
  ) {
    super({
      transform: true,
      whitelist: true,
      ...options
    })
  }

  override async transform(
    value: unknown,
    metadata: ArgumentMetadata
  ): Promise<unknown> {
    try {
      return await super.transform(value, metadata)
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        const target = metadata.metatype

        if (target) {
          const customError = this.reflector.get<
            Record<string, unknown> | string | undefined
          >(DTO_ERROR_METADATA_KEY, target)

          if (customError) {
            throw new BadRequestException(customError)
          }
        }
      }
      throw error
    }
  }
}
