import { HttpService } from '@nestjs/axios'
import { BadGatewayException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as cheerio from 'cheerio'
import { Element } from 'domhandler'
import { catchError, firstValueFrom, throwError } from 'rxjs'

import { EnvConfig } from '../../config/env.validation'

export interface ParsedSupplierItem {
  code: string
  barcode: string
  title: string
  rawStock: string
  price: string
  rrc: string
}

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
    const $ = cheerio.load(htm)
    const items: ParsedSupplierItem[] = []

    $('tr.R8').each((_, element) => {
      const item = this.mapRowToItem($, element)

      if (item.code) {
        items.push(item)
      }
    })

    return items
  }

  private mapRowToItem(
    $: cheerio.CheerioAPI,
    element: Element
  ): ParsedSupplierItem {
    const tds = $(element).find('td')

    return {
      code: $(tds[0]).text().trim(),
      barcode: $(tds[1]).text().trim(),
      title: $(tds[2]).text().trim().replace(/^"|"$/g, ''),
      rawStock: $(tds[4]).text().trim(),
      price: this.cleanPrice($(tds[6]).find('span').text().trim()),
      rrc: this.cleanPrice($(tds[11]).find('span').text().trim())
    }
  }

  private cleanPrice(text: string): string {
    return text.replace(/\s+/g, '').replace(/,/g, '.').trim()
  }
}
