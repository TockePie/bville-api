import { SetMetadata } from '@nestjs/common'

export const DTO_ERROR_METADATA_KEY = 'dto_custom_error'
export type CustomErrorType = Record<string, unknown> | string

export function DtoError(errorResponse: CustomErrorType) {
  return SetMetadata(DTO_ERROR_METADATA_KEY, errorResponse)
}
