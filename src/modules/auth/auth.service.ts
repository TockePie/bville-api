import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { ManagerService } from '../manager/manager.service'

@Injectable()
export class AuthService {
  constructor(
    private manager: ManagerService,
    private jwtService: JwtService
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.manager.validateCredentials(login, password)
    if (!user) throw new UnauthorizedException()

    const { password: _, ...result } = user
    return result
  }

  async login(user: { id: string; login: string }) {
    const payload = { sub: user.id, login: user.login }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
