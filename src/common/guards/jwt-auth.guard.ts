import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodError } from 'zod'

import { JwtPayload, JwtPayloadSchema } from '../../types/jwt'
import { RequestWithCookies } from '../../types/request-with-cookies'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithCookies>()

    const token = req.cookies?.['access_token']
    if (!token) {
      throw new UnauthorizedException('Authentication token missing')
    }

    try {
      const rawPayload = await this.jwtService.verifyAsync<JwtPayload>(token)
      const payload = JwtPayloadSchema.parse(rawPayload)

      req.user = { id: payload.sub, login: payload.login }
    } catch (e) {
      if (e instanceof ZodError) {
        throw new UnauthorizedException('Invalid token payload structure')
      }
      throw new UnauthorizedException('Invalid or expired token')
    }

    return true
  }
}
