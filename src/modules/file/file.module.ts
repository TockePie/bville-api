import { Module } from '@nestjs/common'

import { PrismaModule } from '../../database/prisma.module'
import { FileService } from './file.service'

@Module({
  imports: [PrismaModule],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
