import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: "Username обов'язковий" })
  @Transform(({ value }: { value?: string }) => value?.trim().toLowerCase())
  username: string

  @IsString()
  @IsNotEmpty({ message: "Пароль обов'язковий" })
  @MinLength(8, { message: 'Пароль має складатися щонайменше з 8 символів' })
  password: string
}
