import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// @ts-ignore
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.serivce';
import { Request } from 'express';

@Injectable()
export class GoogleTokenStrategy extends PassportStrategy(Strategy, 'google-token') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    // Lấy token từ body request
    const token = req.body?.token;
    
    if (!token) {
      throw new UnauthorizedException('Google token is missing');
    }

    // Gọi service để xác thực token với Google
    const response = await this.authService.validateGoogleToken({ token });
    
    if (!response) {
      throw new UnauthorizedException('Invalid Google token');
    }
    
    // Trả về thông tin token để đính kèm vào request
    return {
      ...response,
    };
  }
}