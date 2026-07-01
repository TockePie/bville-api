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
  private readonly CACHE_KEY = 'supplier_products'

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
    private supplierParserService: SupplierParserService
  ) {}

  async onModuleInit() {
    this.logger.log(`Fetching products to them into cache at ${Date.now()}`)
    await this.getProducts()
  }

  @Cron('1,31 * * * *')
  async handleCronRefresh() {
    this.logger.log(`Fetching products to them into cache at ${Date.now()}`)
    await this.refreshProductsCache()
  }

  async getProducts() {
    const cachedData = await this.cacheManager.get<string>(this.CACHE_KEY)

    if (!cachedData) {
      return await this.refreshProductsCache()
    }

    return cachedData
  }

  private async refreshProductsCache() {
    const supplierItems = await this.supplierParserService.parseHtmPrices()

    const dbData = await this.fetchData()
    const dbDataMap = new Map(dbData.map((item) => [item.code, item]))

    const result = this.generateXml(supplierItems, dbDataMap)

    await this.cacheManager.set(this.CACHE_KEY, result)

    return result
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
