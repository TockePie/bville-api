import { All, Controller, HttpCode } from '@nestjs/common'

@Controller('*')
export class FallbackController {
  @All()
  @HttpCode(404)
  handleNotFound(): string {
    return 'Ресурс не знайдено.'
  }
}
