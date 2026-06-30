import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { catchError, throwError } from 'rxjs'

import {
  CustomErrorType,
  DTO_ERROR_METADATA_KEY
} from '../decorators/dto-error.decorator'

@Injectable()
export class DtoErrorInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (!(error instanceof BadRequestException)) {
          return throwError(() => error)
        }

        const customError = this.reflector.get<CustomErrorType | undefined>(
          DTO_ERROR_METADATA_KEY,
          context.getHandler()
        )

        if (customError) {
          throw new BadRequestException(customError)
        }

        return throwError(() => error)
      })
    )
  }
}
