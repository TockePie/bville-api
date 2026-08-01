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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RobotGuard } from '../../common/guards/robot.guard'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderQueryDto } from './dto/order-query.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderService } from './order.service'

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrdersForTable(@Query() query: OrderQueryDto) {
    return await this.orderService.getOrdersForTable(query)
  }

  @Get(':guid')
  @UseGuards(JwtAuthGuard)
  async getOrderByGuid(@Param('guid') guid: string) {
    return await this.orderService.getOrderByGuid(guid)
  }

  @Post('create')
  @HttpCode(250)
  @DtoError({ error: 'Недійсні дані замовлення' })
  @UseGuards(RobotGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto)
  }

  @Delete('cancel/:guid')
  @HttpCode(200)
  @UseGuards(RobotGuard)
  async cancelOrder(@Param('guid') guid: string) {
    return this.orderService.cancelOrder(guid)
  }

  @Put('edit/:guid')
  @HttpCode(250)
  @UseGuards(RobotGuard)
  @DtoError({ error: 'Недійсні параметри запиту' })
  async editOder(
    @Param('guid') guid: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return await this.orderService.editOrder(guid, updateOrderDto)
  }

  @Get('status/:guid')
  @UseGuards(RobotGuard)
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
  @UseGuards(RobotGuard)
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
