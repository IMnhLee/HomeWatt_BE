import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleTokenGuard extends AuthGuard('google-token') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Đảm bảo có token trong request
    const request = context.switchToHttp().getRequest();
    if (!request.body?.token) {
      throw new UnauthorizedException('Google token is required');
    }
    
    return super.canActivate(context);
  }
  
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid Google token');
    }
    return user;
  }
}