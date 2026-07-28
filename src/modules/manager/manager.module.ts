import { forwardRef, Module } from '@nestjs/common'

import { PrismaModule } from '../../database/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { OrderModule } from '../order/order.module'
import { ManagerController } from './manager.controller'
import { ManagerService } from './manager.service'

@Module({
  imports: [OrderModule, PrismaModule, forwardRef(() => AuthModule)],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService]
})
export class ManagerModule {}
