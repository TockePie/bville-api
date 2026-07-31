import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { JwtPayload, JwtPayloadSchema } from '../../types/jwt'
import { RequestWithCookies } from '../../types/request-with-cookies'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithCookies>()

    const token = this.extractTokenFromCookies(req)
    const payload = await this.verifyAndParseToken(token)

    req.user = { id: payload.sub, login: payload.login }

    return true
  }

  private extractTokenFromCookies(req: RequestWithCookies) {
    const token = req.cookies?.['access_token']
    if (!token) {
      throw new UnauthorizedException('Authentication token missing')
    }
    return token
  }

  private async verifyAndParseToken(token: string) {
    const rawPayload = await this.jwtService
      .verifyAsync<JwtPayload>(token)
      .catch(() => {
        throw new UnauthorizedException('Invalid or expired token')
      })

    const payload = JwtPayloadSchema.safeParse(rawPayload)
    if (!payload.success) {
      throw new UnauthorizedException('Invalid token payload structure')
    }

    return payload.data
  }
}
