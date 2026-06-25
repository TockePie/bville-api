import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'

import { PrismaService } from '../../config/prisma/prisma.service'
import { Prisma } from '../../generated/prisma/client'
import { OrderStatus } from '../../generated/prisma/enums'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name)

  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const {
      header: { products, CustomerName, deliveryAddresType, ...info }
    } = createOrderDto

    const result = await this.prisma.order.create({
      data: {
        ...info,
        guid: info.partnerOrderId,
        status: 'pending',
        deliveryAddressType: deliveryAddresType,
        customerName: CustomerName,
        orderItems: {
          create: products.map((product) => ({
            supplier_code: product.supplier_code.trim(),
            RZ_code: product.RZ_code,
            quantity: product.quantity,
            price: product.price
          }))
        }
      },
      select: {
        partnerOrderId: true,
        status: true
      }
    })

    return {
      guid: result.partnerOrderId,
      status: result.status
    }
  }

  async cancelOrder(guid: string) {
    const order = await this.prisma.order.findUnique({
      where: { partnerOrderId: guid }
    })
    if (!order) {
      throw new BadRequestException({ error: 'Замовлення не знайдено' })
    }

    return await this.prisma.order
      .update({
        where: { partnerOrderId: guid },
        data: {
          status: OrderStatus.canceled
        },
        select: { partnerOrderId: true, status: true }
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            throw new NotFoundException('Замовлення не знайдено')
          }
        }
      })
  }

  async editOrder(guid: string, updateOrderDto: UpdateOrderDto) {
    const { products, ...flatData } = updateOrderDto

    return await this.prisma.order
      .update({
        where: { guid },
        data: {
          ...flatData,
          ...(products && {
            products: {
              deleteMany: {},
              create: products
            }
          })
        },
        select: {
          partnerOrderId: true,
          status: true
        }
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            throw new NotFoundException('Замовлення не знайдено')
          }
        }

        this.logger.warn(`Unable to update the order: ${e}`)

        throw new BadRequestException('Недійсні параметри запиту')
      })
  }
}
