import { Controller, Get, Header } from '@nestjs/common'

import { RozetkaService } from './rozetka.service'

@Controller('rozetka')
export class RozetkaController {
  constructor(private rozetkaService: RozetkaService) {}

  @Get('products.xml')
  @Header('Content-Type', 'application/xml')
  async getProducts() {
    return await this.rozetkaService.getProducts()
  }
}
