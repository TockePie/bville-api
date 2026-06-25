import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class CreateOrderProductDto {
  @IsString()
  @IsNotEmpty()
  supplier_code: string

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  RZ_code: number

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number

  @IsNumber()
  @IsNotEmpty()
  price: number
}
