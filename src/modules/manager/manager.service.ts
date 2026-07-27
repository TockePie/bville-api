import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class ManagerService {
  constructor(private prisma: PrismaService) {}

  //XXX
  // async createManager(login: string, password: string) {
  //   const hashPass = await hash(password, 10)

  //   return await this.prisma.manager.create({
  //     data: {
  //       login,
  //       password: hashPass
  //     }
  //   })
  // }

  async validateCredentials(login: string, password: string) {
    const user = await this.findByLogin(login)
    if (!user) return null

    const ok = await compare(password, user.password)
    return ok ? user : null
  }

  private async findByLogin(login: string) {
    return await this.prisma.manager.findUnique({
      where: {
        login
      }
    })
  }
}
