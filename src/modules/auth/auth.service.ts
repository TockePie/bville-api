import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { ManagerService } from '../manager/manager.service'

@Injectable()
export class AuthService {
  constructor(
    private manager: ManagerService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    return await this.manager.validateCredentials(username, password)
  }

  async login(user: { id: string; login: string }) {
    const payload = { sub: user.id, login: user.login }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
