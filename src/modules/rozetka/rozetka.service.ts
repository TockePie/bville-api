import { Injectable } from '@nestjs/common'
import { create } from 'xmlbuilder2'

import { PrismaService } from '../../database/prisma.service'
import {
  ParsedSupplierItem,
  SupplierParserService
} from '../supplier-parser/supplier-parser.service'

@Injectable()
export class RozetkaService {
  constructor(
    private prismaService: PrismaService,
    private supplierParserService: SupplierParserService
  ) {}

  async getProducts() {
    const supplierItems = await this.supplierParserService.parseHtmPrices()

    const dbData = await this.fetchData()
    const dbDataMap = new Map(dbData.map((item) => [item.code, item]))

    return this.generateXml(supplierItems, dbDataMap)
  }

  async fetchData() {
    return await this.prismaService.rozetkaProduct.findMany({
      omit: { createdAt: true, updatedAt: true }
    })
  }

  private parseStockData(rawStock: string) {
    const isMoreThanTen = rawStock === '> 10'
    const parsedQty = parseInt(rawStock, 10)
    const hasStock = !Number.isNaN(parsedQty) && parsedQty > 0

    const qty = isMoreThanTen ? 11 : hasStock ? parsedQty : 0
    const available = isMoreThanTen || hasStock ? 'Y' : 'N'

    return { qty, available }
  }

  private generateXml(
    supplierItems: ParsedSupplierItem[],
    itemsMap: Map<string, Awaited<ReturnType<this['fetchData']>>[number]>
  ) {
    const doc = create({ encoding: 'UTF-8' }).ele('items')

    for (const item of supplierItems) {
      const { rawStock, ...product } = item

      const dbItem = itemsMap.get(item.code)

      const { qty, available } = this.parseStockData(rawStock)

      doc.ele('item').ele({
        ...product,
        rzcode: dbItem?.RZ_code ?? '',
        cat: dbItem?.category ?? '',
        brand: dbItem?.brand ?? '',
        qty,
        available
      })
    }

    return doc.end({ prettyPrint: true })
  }
}
