import { Body, Controller, Delete, HttpCode, Param, Post } from '@nestjs/common'

import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'

//TODO: Use guard to check robot's API
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  //TODO: make 400 error object like: {"error": "Недійсні дані замовлення"}
  @Post('create')
  @HttpCode(250)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto)
  }

  @Delete('cancel/:guid')
  @HttpCode(200)
  async cancelOrder(@Param('guid') guid: string) {
    return this.orderService.cancelOrder(guid)
  }
}
