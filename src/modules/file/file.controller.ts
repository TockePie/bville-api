import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Delete(':file_guid/delete')
  @HttpCode(200)
  async deleteFile(@Param('file_guid') fileGuid: string) {
    return await this.fileService.deleteFile(fileGuid)
  }
}
