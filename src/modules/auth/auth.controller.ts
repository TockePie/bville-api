import { Controller, Post, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { Response } from 'express'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @CurrentUser() user: { id: string; login: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token } = await this.authService.login(user)

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60
    })

    return { message: 'Logged in successfully' }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token')

    return { message: 'Logged out successfully' }
  }
}
