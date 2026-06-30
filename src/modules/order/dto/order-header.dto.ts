import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

import { CreateOrderProductDto } from './create-order-product.dto'

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
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[]
}
