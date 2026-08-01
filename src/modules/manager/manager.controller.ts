import { Controller, Get, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import type { RequestWithCookies } from '../../types/request-with-cookies'
import { ManagerService } from './manager.service'

@UseGuards(JwtAuthGuard)
@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  @Get('info')
  async getManagersInfo(@Req() req: RequestWithCookies) {
    return await this.managerService.findById(req.user!.id)
  }
}
