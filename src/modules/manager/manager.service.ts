import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class ManagerService {
  constructor(private prisma: PrismaService) {}

  async validateCredentials(username: string, formPassword: string) {
    const user = await this.findByLogin(username)
    if (!user) return null

    const { password, ...filteredUser } = user

    const isValidPassword = await compare(formPassword, password)
    return isValidPassword ? filteredUser : null
  }

  private async findByLogin(login: string) {
    return await this.prisma.manager.findUnique({
      where: {
        login
      }
    })
  }

  async findById(id: string) {
    return await this.prisma.manager.findUnique({
      where: {
        id
      },
      select: {
        login: true,
        name: true,
        imageUrl: true
      }
    })
  }
}
