import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'

import { AllExceptionsFilter } from './common/filters/all-exception.filter'
import { DtoErrorInterceptor } from './common/interceptors/dto-error.interceptor'
import { validateEnv } from './config/env.validation'
import { AuthModule } from './modules/auth/auth.module'
import { FileModule } from './modules/file/file.module'
import { ManagerModule } from './modules/manager/manager.module'
import { OrderModule } from './modules/order/order.module'
import { RozetkaModule } from './modules/rozetka/rozetka.module'
import { SupplierParserModule } from './modules/supplier-parser/supplier-parser.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv
    }),
    ScheduleModule.forRoot(),

    AuthModule,
    FileModule,
    ManagerModule,
    OrderModule,
    RozetkaModule,
    SupplierParserModule
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
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule {}
