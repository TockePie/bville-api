import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'

import { OrderStatus } from '../../../generated/prisma/enums'

export class OrderQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize: number = 10

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus

  @IsString()
  @IsOptional()
  search: string = ''

  @IsEnum(['updatedAt', 'createdAt', 'customerName', 'cashOnDelivery'])
  @IsOptional()
  sortBy: 'updatedAt' | 'createdAt' | 'customerName' | 'cashOnDelivery' =
    'updatedAt'

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'desc'
}
