import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'

import { EnvConfig } from '../../config/env.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<EnvConfig, true>) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null
        if (req && req.cookies) {
          token = req.cookies['access_token']
        }
        return token
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', {
        infer: true
      })
    })
  }

  validate(payload: { sub: string; login: string }) {
    return { userId: payload.sub, login: payload.login }
  }
}
