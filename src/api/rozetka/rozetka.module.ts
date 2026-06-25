import { Module } from '@nestjs/common'

import { PrismaModule } from '../../config/prisma/prisma.module'
import { SupplierParserModule } from '../supplier-parser/supplier-parser.module'
import { RozetkaController } from './rozetka.controller'
import { RozetkaService } from './rozetka.service'

@Module({
  imports: [PrismaModule, SupplierParserModule],
  controllers: [RozetkaController],
  providers: [RozetkaService]
})
export class RozetkaModule {}
