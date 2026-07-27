import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { OrderQueryDto } from '../order/dto/order-query.dto'
import { OrderService } from '../order/order.service'

@Controller()
export class ManagerController {
  constructor(private orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('order')
  async getOrdersForTable(@Query() query: OrderQueryDto) {
    return await this.orderService.getOrdersForTable(query)
  }
}
