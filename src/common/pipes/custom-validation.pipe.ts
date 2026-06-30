import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Optional,
  ValidationPipe
} from '@nestjs/common'
import { type ValidationPipeOptions } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import {
  CustomErrorType,
  DTO_ERROR_METADATA_KEY
} from '../decorators/dto-error.decorator'

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
    return await super.transform(value, metadata).catch((error: unknown) => {
      if (!(error instanceof BadRequestException) || !metadata.metatype) {
        throw error
      }

      const customError = this.reflector.get<CustomErrorType | undefined>(
        DTO_ERROR_METADATA_KEY,
        metadata.metatype
      )

      if (customError) {
        throw new BadRequestException(customError)
      }

      throw error
    })
  }
}
