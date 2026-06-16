import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

import { PrismaClient } from '../../generated/prisma/client'
import { EnvConfig } from '../env.validation'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor(configService: ConfigService<EnvConfig, true>) {
    const adapter = new PrismaMariaDb({
      host: configService.get('DATABASE_HOST', {
        infer: true
      }),
      port: configService.get('DATABASE_PORT', {
        infer: true
      }),
      user: configService.get('DATABASE_USER', {
        infer: true
      }),
      password: configService.get('DATABASE_PASSWORD', {
        infer: true
      }),
      database: configService.get('DATABASE_NAME', {
        infer: true
      })
    })

    super({ adapter })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log('Prisma connected')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(errorMessage)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
