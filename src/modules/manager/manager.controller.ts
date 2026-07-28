import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import type { RequestWithCookies } from '../../types/request-with-cookies'
import { OrderQueryDto } from '../order/dto/order-query.dto'
import { OrderService } from '../order/order.service'
import { ManagerService } from './manager.service'

@UseGuards(JwtAuthGuard)
@Controller()
export class ManagerController {
  constructor(
    private orderService: OrderService,
    private managerService: ManagerService
  ) {}

  @Get('order')
  async getOrdersForTable(@Query() query: OrderQueryDto) {
    return await this.orderService.getOrdersForTable(query)
  }

  @Get('manager/info')
  async getManagersInfo(@Req() req: RequestWithCookies) {
    return await this.managerService.findById(req.user!.id)
  }
}
