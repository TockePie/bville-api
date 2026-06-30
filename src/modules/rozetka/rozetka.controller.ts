import { Controller, Get } from '@nestjs/common'

import { RozetkaService } from './rozetka.service'

@Controller('rozetka')
export class RozetkaController {
  constructor(private rozetkaService: RozetkaService) {}

  //TODO: Make caching for this route
  @Get('products.xml')
  async getProducts() {
    return await this.rozetkaService.getProducts()
  }
}
