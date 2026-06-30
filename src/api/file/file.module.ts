import { Module } from '@nestjs/common'

import { PrismaModule } from '../../config/prisma/prisma.module'
import { FileService } from './file.service'

@Module({
  imports: [PrismaModule],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
