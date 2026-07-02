import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    if (res.headersSent) {
      return
    }

    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    if (status === HttpStatus.NOT_FOUND) {
      return res.status(status).send('Ресурс не знайдено.')
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return res.status(status).send('Загальні помилки сервера.')
    }

    const nestResponse = (exception as HttpException).getResponse()

    return typeof nestResponse === 'object'
      ? res.status(status).json(nestResponse)
      : res.status(status).json({ statusCode: status, message: nestResponse })
  }
}
