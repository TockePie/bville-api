import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class CreateOrderProductDto {
  @IsString()
  @IsNotEmpty()
  supplier_code: string

  @IsNotEmpty()
  RZ_code: string | number

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number

  @IsNumber()
  @IsNotEmpty()
  price: number
}
