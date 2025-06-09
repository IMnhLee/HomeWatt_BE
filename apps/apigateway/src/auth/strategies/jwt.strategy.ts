import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.serivce';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      passReqToCallback: true, // Để nhận request trong validate
    });
  }

  async validate(req: Request, payload: any) {
    try {
      // Lấy token từ request
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      
      // Xác thực token với auth service
      const response = await this.authService.verifyToken({ token });
      
      // if (!response || !response.data || !response.data.isValid) {
      //   throw new UnauthorizedException('Invalid or revoked token');
      // }

      
      // Trả về đối tượng user từ payload JWT
      return {
        id: response.data.sub,
        email: response.data.email,
        role: response.data.role || 'user',
        active: response.data.active,
        // Thêm các thông tin khác từ payload nếu cần
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}