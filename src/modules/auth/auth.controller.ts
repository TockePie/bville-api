import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token } = await this.authService.login(body)

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  checkAuth() {
    return {
      authenticated: true
    }
  }
}
