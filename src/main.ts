import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

//TODO: create a global exception filter to output this message:
// 404 Not Found: Ресурс не знайдено.
// 500 Internal Server Error: Загальні помилки сервера.
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
