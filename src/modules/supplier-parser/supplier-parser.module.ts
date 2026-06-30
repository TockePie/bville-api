import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { SupplierParserService } from './supplier-parser.service'

@Module({
  imports: [HttpModule],
  providers: [SupplierParserService],
  exports: [SupplierParserService]
})
export class SupplierParserModule {}
