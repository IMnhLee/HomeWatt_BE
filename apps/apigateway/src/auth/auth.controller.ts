import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.serivce';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleTokenGuard } from './guards/google-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthDTO } from '@app/common';
import { UseInterceptors } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('Authentication failed');
    }
    
    return {
      message: 'Login successful',
      data: req.user,
    };
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Body() refreshRequest: AuthDTO.RefreshTokenRequest) {
    return this.authService.refreshToken(refreshRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() logoutRequest: AuthDTO.RefreshTokenRequest) {
    return this.authService.logout(logoutRequest);
  }

  @Public()
  @UseGuards(GoogleTokenGuard)
  @Post('google/token')
  async googleToken(@Req() req) {
    return {
      status: {
        code: 200,
        message: 'Google authentication successful',
      },
      data: req.user, // GoogleTokenGuard đã xác thực và gắn data vào req.user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user) {
    return {
      status: {
        code: 200,
        message: 'Profile fetched successfully',
      },
      data: user,
    };
  }

  @Public()
  @Post('register')
  async register(@Body() registerRequest: AuthDTO.RegisterRequest) {
    return this.authService.register(registerRequest);
  }
}