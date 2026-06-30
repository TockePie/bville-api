import { randomUUID } from 'node:crypto'
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import { Injectable, InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class FileService {
  private uploadDir = path.resolve(__dirname, '..', '..', 'uploads')

  constructor() {
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
}
