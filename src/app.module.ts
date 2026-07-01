import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'

import { DtoErrorInterceptor } from './common/interceptors/dto-error.interceptor'
import { validateEnv } from './config/env.validation'
import { FileModule } from './modules/file/file.module'
import { OrderModule } from './modules/order/order.module'
import { RozetkaModule } from './modules/rozetka/rozetka.module'
import { SupplierParserModule } from './modules/supplier-parser/supplier-parser.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv
    }),
    OrderModule,
    FileModule,
    RozetkaModule,
    SupplierParserModule,
    ScheduleModule.forRoot()
  ],
  providers: [
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
