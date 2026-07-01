import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common'

import { RobotGuard } from '../../common/guards/robot.guard'
import { FileService } from './file.service'

@Controller('file')
@UseGuards(RobotGuard)
export class FileController {
  constructor(private fileService: FileService) {}

  @Delete(':file_guid/delete')
  @HttpCode(200)
  async deleteFile(@Param('file_guid') fileGuid: string) {
    return await this.fileService.deleteFile(fileGuid)
  }
}
