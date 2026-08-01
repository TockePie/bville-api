import { forwardRef, Module } from '@nestjs/common'

import { PrismaModule } from '../../database/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { FileModule } from '../file/file.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  imports: [PrismaModule, FileModule, forwardRef(() => AuthModule)],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
