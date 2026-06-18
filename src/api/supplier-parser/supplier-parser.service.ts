import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as cheerio from 'cheerio'
import { catchError, firstValueFrom, of } from 'rxjs'

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
    const SUPPLIER_URL = this.configService.get('SUPPLIER_URL', {
      infer: true
    })
    const res = await firstValueFrom(
      this.httpService.get(SUPPLIER_URL, { responseType: 'text' }).pipe(
        catchError((err: Error) => {
          this.logger.error(
            `Unable to fetch items from supplier: ${err.message}`
          )

          return of({ data: '' })
        })
      )
    )

    const $ = cheerio.load(res.data)
    const items: ParsedSupplierItem[] = []

    $('tr.R8').each((_i, element) => {
      const tds = $(element).find('td')

      const item = {
        code: $(tds[0]).text().trim(),
        barcode: $(tds[1]).text().trim(),
        title: $(tds[2]).text().trim().replace(/^"|"$/g, ''),
        rawStock: $(tds[4]).text().trim(),
        price: this.cleanPrice($(tds[6]).find('span').text().trim()),
        rrc: this.cleanPrice($(tds[11]).find('span').text().trim())
      }

      if (item.code) {
        items.push(item)
      }
    })

    return items
  }

  private cleanPrice(text: string): string {
    return text.replace(/\s+/g, '').replace(/,/g, '.').trim()
  }
}
