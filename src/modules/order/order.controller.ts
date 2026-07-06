import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { type Request, type Response } from 'express'

import { DtoError } from '../../common/decorators/dto-error.decorator'
import { RobotGuard } from '../../common/guards/robot.guard'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderQueryDto } from './dto/order-query.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderService } from './order.service'

@Controller('order')
@UseGuards(RobotGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  //TODO: This endpoint should be accessible only via JWT Token
  @Get()
  async getOrders(@Query() query: OrderQueryDto) {
    return await this.orderService.getOrders(query)
  }

  @Post('create')
  @HttpCode(250)
  @DtoError({ error: 'Недійсні дані замовлення' })
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
  @DtoError({ error: 'Недійсні параметри запиту' })
  async editOder(
    @Param('guid') guid: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return await this.orderService.editOrder(guid, updateOrderDto)
  }

  @Get('status/:guid')
  async checkOrderStatus(
    @Param('guid') guid: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.orderService.checkOrderStatus(guid)

    if (data.status === 'pending') {
      res.status(250)
    } else {
      res.status(200)
    }

    return data
  }

  @Post(':guid/upload')
  async uploadFile(
    @Param('guid') guid: string,
    @Req() req: Request,
    @Headers('content-type') contentType: string
  ) {
    if (contentType !== 'application/octet-stream') {
      throw new BadRequestException({
        error: 'Очікується формат application/octet-stream'
      })
    }

    return await this.orderService.uploadFile(guid, req)
  }
}
