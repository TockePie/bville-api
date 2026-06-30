import { randomUUID } from 'node:crypto'
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { CatchPrisma } from '../../common/decorators/catch-prisma-error.decorator'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class FileService {
  private uploadDir = path.resolve(__dirname, '..', '..', 'uploads')

  constructor(private prisma: PrismaService) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadFile(fileStream: Readable) {
    const fileGuid = randomUUID()
    const fileNameOnDisk = `${fileGuid}.bin`
    const absoluteFilePath = path.join(this.uploadDir, fileNameOnDisk)
    const relativeFilePath = `uploads/${fileNameOnDisk}`

    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(absoluteFilePath)
      fileStream.pipe(writeStream)

      writeStream.on('finish', resolve)
      writeStream.on('error', (err) =>
        reject(
          new InternalServerErrorException({
            error: 'Помилка під час збереження',
            details: err
          })
        )
      )
    })

    return {
      fileGuid,
      relativeFilePath
    }
  }

  @CatchPrisma({ P2025: 'файл не знайдено' })
  async deleteFile(fileGuid: string) {
    await this.prisma.orderFile.delete({
      where: { file_guid: fileGuid }
    })

    return {
      success: true,
      message: 'Файл успішно видалено'
    }
  }
}
