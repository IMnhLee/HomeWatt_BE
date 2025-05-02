import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminRoleGuard extends JwtAuthGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, ensure the user is authenticated with JWT
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // Get the authenticated user from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user has admin role
    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied: Admin role required');
    }

    return true;
  }
}