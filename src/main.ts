import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  //TODO: Use production's url
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
