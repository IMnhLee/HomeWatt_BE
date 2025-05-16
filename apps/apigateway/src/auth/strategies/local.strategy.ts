import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.serivce';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const response = await this.authService.login({ email, password });

    // if (response.status?.code !== 200 || !response.data) {
    //   throw new UnauthorizedException(response.status?.message);
    // }
    
    return response.data;
  }
}