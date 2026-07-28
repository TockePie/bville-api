import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { ManagerService } from '../manager/manager.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private manager: ManagerService,
    private jwtService: JwtService
  ) {}

  async login(body: LoginDto) {
    const user = await this.manager.validateCredentials(
      body.username,
      body.password
    )
    if (!user) throw new UnauthorizedException()

    const payload = { sub: user.id, login: user.login }
    const access_token = this.jwtService.sign(payload)

    return { access_token }
  }
}
