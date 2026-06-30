import { OmitType } from '@nestjs/mapped-types'

import { OrderHeaderDto } from './order-header.dto'

export class UpdateOrderDto extends OmitType(OrderHeaderDto, [
  'partnerOrderId'
] as const) {}
