import { Module } from '@nestjs/common'

import { PrismaModule } from '../../config/prisma/prisma.module'
import { FileModule } from '../file/file.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  imports: [PrismaModule, FileModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
