import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'

//TODO: Use guard to check robot's API
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  @HttpCode(250)
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto)
  }
}
