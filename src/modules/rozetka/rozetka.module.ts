import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'

import { PrismaModule } from '../../database/prisma.module'
import { SupplierParserModule } from '../supplier-parser/supplier-parser.module'
import { RozetkaController } from './rozetka.controller'
import { RozetkaService } from './rozetka.service'

@Module({
  imports: [
    CacheModule.register({
      ttl: 360000
    }),
    PrismaModule,
    SupplierParserModule
  ],
  controllers: [RozetkaController],
  providers: [RozetkaService]
})
export class RozetkaModule {}
