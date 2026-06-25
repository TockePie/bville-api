import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'

import { OrderModule } from './api/order/order.module'
import { RozetkaModule } from './api/rozetka/rozetka.module'
import { SupplierParserModule } from './api/supplier-parser/supplier-parser.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { validateEnv } from './config/env.validation'
import { DtoErrorInterceptor } from './config/interceptors/dto-error.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv
    }),
    OrderModule,
    RozetkaModule,
    SupplierParserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true
      })
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DtoErrorInterceptor
    }
  ]
})
export class AppModule {}
