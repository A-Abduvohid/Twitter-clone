import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, RefreshTokenDto, SignInUserDto, VerifyOtpDto } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role, Roles } from 'src/common/guards/roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiProperty({ type: CreateUserDto })
  @Post('sign-up')
  async sign_up(@Body() createAuthDto: CreateUserDto) {
    return await this.authService.sign_up(createAuthDto);
  }

  @ApiProperty({ type: SignInUserDto })
  @Post('sign-in')
  async sign_in(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.sign_in(signInUserDto);
  }

  @ApiProperty({ type: VerifyOtpDto })
  @Post('verify-otp')
  async verify_otp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verify_otp(verifyOtpDto);
  }

  @ApiProperty({ type: RefreshTokenDto })
  @Post('refresh-token')
  async refresh_token(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh_token(refreshTokenDto.token);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get('getMe')
  async getMe(@Req() request: Request) {
    return await this.authService.getMe(request);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get('logout')
  async logout(@Req() request: Request) {
    return await this.authService.logout(request);
  }
}
