import { SetMetadata } from '@nestjs/common'

export const DTO_ERROR_METADATA_KEY = 'dto_custom_error'

export const DtoError = (errorResponse: Record<string, unknown> | string) => {
  return SetMetadata(DTO_ERROR_METADATA_KEY, errorResponse)
}
