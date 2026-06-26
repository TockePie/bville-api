import { randomUUID } from 'node:crypto'
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'

import { CatchPrisma } from '../../config/decorators/catch-prisma-error.decorator'
import { PrismaService } from '../../config/prisma/prisma.service'
import { OrderStatus } from '../../generated/prisma/enums'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrderService {
  private uploadDir = path.resolve(__dirname, '..', '..', 'uploads')

  constructor(private prisma: PrismaService) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  @CatchPrisma({ P2002: 'Товар з таким partnerOrderId вже існує' })
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

  @CatchPrisma({ P2025: 'Замовлення не знайдено' })
  async cancelOrder(guid: string) {
    return await this.prisma.order.update({
      where: { partnerOrderId: guid },
      data: {
        status: OrderStatus.canceled
      },
      select: { partnerOrderId: true, status: true }
    })
  }

  @CatchPrisma({ P2025: 'Замовлення не знайдено' })
  async editOrder(guid: string, updateOrderDto: UpdateOrderDto) {
    const { products, ...flatData } = updateOrderDto

    return await this.prisma.order.update({
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
  }

  async checkOrderStatus(guid: string) {
    const response = await this.prisma.order.findUnique({
      where: { guid },
      select: {
        guid: true,
        status: true,
        partnerOrderId: true,
        tracking_number: true,
        orderItems: true
      }
    })

    if (!response) {
      throw new BadRequestException({ error: 'Замовлення не знайдено' })
    }

    if (response?.status === 'pending') {
      return {
        partnerOrderId: response.partnerOrderId,
        status: response.status
      }
    }

    return {
      guid: response.guid,
      status: response.status,
      tracking_number: response.tracking_number,
      products: response.orderItems
    }
  }

  async uploadFile(guid: string, fileStream: Readable) {
    const order = await this.prisma.order.findUnique({
      where: { guid },
      select: { guid: true }
    })
    if (!order) {
      throw new BadRequestException({ error: 'Замовлення не знайдено' })
    }

    const fileGuid = randomUUID()
    const fileNameOnDisk = `${fileGuid}.bin`
    const absoluteFilePath = path.join(this.uploadDir, fileNameOnDisk)
    const relativeFilePath = `uploads/${fileNameOnDisk}`

    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(absoluteFilePath)
      fileStream.pipe(writeStream)

      writeStream.on('finish', resolve)
      writeStream.on('error', (err) =>
        reject(
          new InternalServerErrorException({
            error: 'Помилка під час збереження',
            details: err
          })
        )
      )
    })

    await this.prisma.orderFile.create({
      data: {
        file_guid: fileGuid,
        orderGuid: order.guid,
        filePath: relativeFilePath,
        fileName: `file_${fileGuid}.bin`
      }
    })

    return {
      success: true,
      file_guid: fileGuid,
      message: 'Файл успішно завантажено'
    }
  }
}
