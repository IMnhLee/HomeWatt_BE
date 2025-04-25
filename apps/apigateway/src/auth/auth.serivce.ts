import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { handleMicroserviceResponse } from '@app/common';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthDTO.AuthServiceClient;

  constructor(@Inject(AuthDTO.AUTH_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthDTO.AuthServiceClient>(
      AuthDTO.AUTH_SERVICE_NAME,
    );
  }

  async login(loginDto: AuthDTO.LoginRequest) {
    const response = await firstValueFrom(this.authService.login(loginDto));
    return handleMicroserviceResponse(response);
  }

  async refreshToken(refreshTokenDto: AuthDTO.RefreshTokenRequest) {
    const response = await firstValueFrom(this.authService.refreshToken(refreshTokenDto));
    return handleMicroserviceResponse(response);
  }

  async logout(refreshTokenDto: AuthDTO.RefreshTokenRequest) {
    const response = await firstValueFrom(this.authService.logout(refreshTokenDto));
    return handleMicroserviceResponse(response);
  }
  
  // googleLogin(googleDto: AuthDTO.GoogleLoginRequest) {
  //   return this.authService.googleLogin(googleDto);
  // }

  async validateGoogleToken(tokenDto: AuthDTO.GoogleTokenRequest) {
    const response = await firstValueFrom(this.authService.validateGoogleToken(tokenDto));
    return handleMicroserviceResponse(response);
  }

  async verifyToken(token: AuthDTO.VerifyTokenRequest) {
    const response = await firstValueFrom(this.authService.verifyToken(token));
    return handleMicroserviceResponse(response);
  }

  // async validateToken(token: string): Promise<AuthDTO.ValidateTokenResponse> {
  //   return firstValueFrom(
  //     this.authService.validateToken({ token })
  //   );
  // }
}