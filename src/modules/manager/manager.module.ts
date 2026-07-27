import { Module } from '@nestjs/common'

import { OrderModule } from '../order/order.module'
import { ManagerController } from './manager.controller'

@Module({
  imports: [OrderModule],
  controllers: [ManagerController]
})
export class ManagerModule {}
