import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

import { CreateOrderProductDto } from './create-order-product'

export class OrderHeaderDto {
  @IsString()
  @IsNotEmpty()
  partnerOrderId: string

  @IsString()
  @IsOptional()
  comment?: string

  @IsString()
  @IsNotEmpty()
  deliveryAddresType: string

  @IsNumber()
  cashOnDelivery: number

  @IsString()
  @IsNotEmpty()
  deliveryCompanyName: string

  @IsString()
  @IsNotEmpty()
  deliveryAddressId: string

  @IsString()
  @IsNotEmpty()
  CustomerName: string

  @IsString()
  @IsNotEmpty()
  deliveryCity: string

  @IsString()
  @IsNotEmpty()
  deliveryPhone: string

  @IsString()
  @IsNotEmpty()
  deliveryStreet: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  @IsNotEmpty()
  products: CreateOrderProductDto[]
}
