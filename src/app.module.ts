import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { OrderModule } from './api/order/order.module'
import { RozetkaModule } from './api/rozetka/rozetka.module'
import { SupplierParserModule } from './api/supplier-parser/supplier-parser.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { validateEnv } from './config/env.validation'

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
  providers: [AppService]
})
export class AppModule {}
