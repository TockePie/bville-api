import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

import { OrderHeaderDto } from './order-header.dto'

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => OrderHeaderDto)
  @IsNotEmpty()
  header: OrderHeaderDto
}
