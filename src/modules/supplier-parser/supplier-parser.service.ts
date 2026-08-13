import { HttpService } from '@nestjs/axios'
import { BadGatewayException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CheerioAPI, load } from 'cheerio'
import { Element } from 'domhandler'
import { catchError, firstValueFrom, throwError } from 'rxjs'

import { EnvConfig } from '../../config/env.schema'

export interface ParsedSupplierItem {
  code: string
  barcode: string
  title: string
  rawStock: string
  url: string
  price: string
  rrc: string
}

const COLUMNS = {
  CODE: 0,
  BARCODE: 1,
  TITLE: 2,
  STOCK: 4,
  URL: 5,
  PRICE: 6,
  RRC: 11
} as const

@Injectable()
export class SupplierParserService {
  private logger = new Logger(SupplierParserService.name)

  constructor(
    private httpService: HttpService,
    private configService: ConfigService<EnvConfig, true>
  ) {}

  async parseHtmPrices(): Promise<ParsedSupplierItem[]> {
    const data = await this.fetchHtm()
    return this.extractItemsFromHtm(data)
  }

  private async fetchHtm() {
    const url = this.configService.get('SUPPLIER_URL', {
      infer: true
    })

    const res = await firstValueFrom(
      this.httpService.get<string>(url, { responseType: 'text' }).pipe(
        catchError((err: Error) => {
          this.logger.error(
            `Unable to fetch items from supplier: ${err.message}`
          )

          return throwError(
            () => new BadGatewayException('Supplier website is unavailable.')
          )
        })
      )
    )

    const htm: string = res.data
    return htm
  }

  private extractItemsFromHtm(htm: string): ParsedSupplierItem[] {
    const $ = load(htm)

    const items = $('tr.R8')
      .map((_, element) => this.mapRowToItem($, element))
      .toArray()

    const validItems = items.filter((item) => item.code)
    if (validItems.length === 0) {
      this.logger.warn(
        'No valid items were parsed. Has the supplier HTML structure changed?'
      )
    }

    return items
  }

  private mapRowToItem($: CheerioAPI, element: Element): ParsedSupplierItem {
    const tds = $(element).find('td')

    return {
      code: $(tds[COLUMNS.CODE]).text().trim(),
      barcode: $(tds[COLUMNS.BARCODE]).text().trim(),
      title: $(tds[COLUMNS.TITLE]).text().trim().replace(/^"|"$/g, ''),
      rawStock: $(tds[COLUMNS.STOCK]).text().trim(),
      url: $(tds[COLUMNS.URL]).text().trim(),
      price: this.cleanPrice($(tds[COLUMNS.PRICE]).find('span').text()),
      rrc: this.cleanPrice($(tds[COLUMNS.RRC]).find('span').text())
    }
  }

  private cleanPrice(text: string): string {
    return text.replace(/\s+/g, '').replace(/,/g, '.')
  }
}
