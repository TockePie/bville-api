import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put
} from '@nestjs/common'

import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
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

  @Put('edit/:guid')
  @HttpCode(250)
  async editOder(
    @Param('guid') guid: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return await this.orderService.editOrder(guid, updateOrderDto)
  }
}
