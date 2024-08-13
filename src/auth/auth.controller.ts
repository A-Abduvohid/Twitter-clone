import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async sign_up(@Body() createAuthDto: CreateUserDto) {
    return await this.authService.sign_up(createAuthDto);
  }

  @Post('sign-in')
  async sign_in(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.sign_in(signInUserDto);
  }

  @Post('refresh-token')
  async refresh_token(@Body() refreshToken: { token: string }) {
    return await this.authService.refresh_token(refreshToken.token);
  }

  @Get('getMe')
  async getMe() {
    return await this.authService.getMe();
  }

  @Get('logout')
  async logout() {
    return await this.authService.logout();
  }
}
