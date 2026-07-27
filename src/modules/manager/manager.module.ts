import { Module } from '@nestjs/common'

import { PrismaModule } from '../../database/prisma.module'
import { OrderModule } from '../order/order.module'
import { ManagerController } from './manager.controller'
import { ManagerService } from './manager.service'

@Module({
  imports: [OrderModule, PrismaModule],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService]
})
export class ManagerModule {}
