import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthDTO } from '@app/common';

@Controller('auth')
@AuthDTO.AuthServiceControllerMethods()
export class AuthController implements AuthDTO.AuthServiceController {
  constructor(private authService: AuthService) {}

  async login(loginRequest: AuthDTO.LoginRequest) {
    return this.authService.login(loginRequest);
  }

  async refreshToken(refreshRequest: AuthDTO.RefreshTokenRequest) {
    return this.authService.refreshToken(refreshRequest);
  }

  async logout(logoutRequest: AuthDTO.RefreshTokenRequest) {
    return this.authService.logout(logoutRequest);
  }

  async validateGoogleToken(tokenRequest: AuthDTO.GoogleTokenRequest) {
    return this.authService.validateGoogleToken(tokenRequest);
  }

  // async googleAuth() {
  //   // Initiates the Google OAuth2 login flow
  //   // This endpoint redirects to Google
  // }

  // async googleAuthCallback(req: Request) {
  //   const user = req.user;
  //   return this.authService.googleLogin({
  //     email: user['email'],
  //     displayName: user['displayName'],
  //     imageUrl: user['picture']
  //   });
  // }

  // getProfile(user) {
  //   return {
  //     status: {
  //       code: 200,
  //       message: 'Profile fetched successfully'
  //     },
  //     data: user
  //   };
  // }

  async verifyToken(verifyRequest: AuthDTO.VerifyTokenRequest) {
    return this.authService.verifyToken(verifyRequest);
  }
}