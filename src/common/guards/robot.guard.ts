import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'

import { EnvConfig } from '../../config/env.validation'

@Injectable()
export class RobotGuard implements CanActivate {
  constructor(private configService: ConfigService<EnvConfig, true>) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()

    const authHeader = req.headers.authorization
    const rozetkaApi = this.configService.get('ROZETKA_API_KEY', {
      infer: true
    })

    if (!authHeader || rozetkaApi !== authHeader) {
      res.status(401).send('Невірний або відсутній API-ключ.')
      return false
    }

    return true
  }
}
