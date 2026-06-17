import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from '../../config/prisma/prisma.service'
import { OrderStatus } from '../../generated/prisma/enums'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { header } = createOrderDto

    const result = await this.prisma.order.create({
      data: {
        partnerOrderId: header.partnerOrderId,
        comment: header.comment,
        deliveryAddressType: header.deliveryAddresType,
        cashOnDelivery: header.cashOnDelivery,
        deliveryCompanyName: header.deliveryCompanyName,
        deliveryAddressId: header.deliveryAddressId,
        customerName: header.CustomerName,
        deliveryCity: header.deliveryCity,
        deliveryPhone: header.deliveryPhone,
        deliveryStreet: header.deliveryStreet,
        orderItems: {
          create: header.products.map((product) => ({
            supplier_code: product.supplier_code.trim(),
            RZ_code:
              typeof product.RZ_code === 'string'
                ? parseInt(product.RZ_code, 10)
                : product.RZ_code,
            quantity: product.quantity,
            price: product.price
          }))
        }
      }
    })

    return {
      guid: result.partnerOrderId,
      status: 'pending'
    }
  }

  async cancelOrder(guid: string) {
    const order = await this.prisma.order.findUnique({
      where: { partnerOrderId: guid }
    })
    if (!order) {
      throw new BadRequestException({ error: 'Замовлення не знайдено' })
    }

    const updatedOrder = await this.prisma.order.update({
      where: { partnerOrderId: guid },
      data: {
        status: OrderStatus.canceled
      }
    })

    return {
      partnerOrderId: updatedOrder.partnerOrderId,
      status: 'canceled'
    }
  }
}
