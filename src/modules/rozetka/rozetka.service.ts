import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import type { Cache } from 'cache-manager'
import { create } from 'xmlbuilder2'

import { PrismaService } from '../../database/prisma.service'
import {
  ParsedSupplierItem,
  SupplierParserService
} from '../supplier-parser/supplier-parser.service'

@Injectable()
export class RozetkaService implements OnModuleInit {
  private logger = new Logger(RozetkaService.name)

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
    private supplierParserService: SupplierParserService
  ) {}

  async onModuleInit() {
    await this.handleCronRefresh()
  }

  @Cron('1,31 * * * *')
  async handleCronRefresh() {
    this.logger.log(
      `Fetching products to place them in the cache at ${Date.now()}`
    )
    await this.getProducts('xml')
    await this.getProducts('json')
  }

  async getProducts(format: 'json' | 'xml') {
    const cacheKey =
      format === 'json' ? 'supplier_products_json' : 'supplier_products_xml'
    const cachedData = await this.cacheManager.get<string>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    const [supplierItems, dbDataMap] = await Promise.all([
      this.supplierParserService.parseHtmPrices(),
      this.fetchAndMapDbData()
    ])
    const transformedItems = this.transformItems(supplierItems, dbDataMap)
    const result = this.serializeData(transformedItems, format)

    await this.cacheManager.set(cacheKey, result)

    return result
  }

  private async fetchAndMapDbData() {
    const data = await this.prismaService.rozetkaProduct.findMany({
      omit: { createdAt: true, updatedAt: true }
    })

    const dataMap = new Map(data.map((item) => [item.code, item]))
    return dataMap
  }

  private transformItems(
    supplierItems: ParsedSupplierItem[],
    dbDataMap: Awaited<
      ReturnType<typeof RozetkaService.prototype.fetchAndMapDbData>
    >
  ) {
    return supplierItems.map((item) => {
      const { rawStock, ...product } = item
      const dbItem = dbDataMap.get(item.code)
      const { qty, available } = this.parseStockData(rawStock)

      return {
        ...product,
        rzcode: dbItem?.RZ_code ?? '',
        cat: dbItem?.category ?? '',
        brand: dbItem?.brand ?? '',
        qty,
        available
      }
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

  private serializeData(
    items: ReturnType<typeof RozetkaService.prototype.transformItems>,
    format: 'json' | 'xml'
  ): string {
    if (format === 'json') {
      return JSON.stringify({ items }, null, 2)
    }

    const doc = create({ encoding: 'UTF-8' }).ele('items')
    for (const item of items) {
      doc.ele('item').ele(item)
    }
    return doc.end({ prettyPrint: true })
  }
}
