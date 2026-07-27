import { Controller, Get, Query } from '@nestjs/common'

import { OrderQueryDto } from '../order/dto/order-query.dto'
import { OrderService } from '../order/order.service'

@Controller()
export class ManagerController {
  constructor(private orderService: OrderService) {}

  @Get('order')
  async getOrdersForTable(@Query() query: OrderQueryDto) {
    return await this.orderService.getOrdersForTable(query)
  }
}
