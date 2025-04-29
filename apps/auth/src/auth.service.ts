import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { RedisService } from './redis/redis.service';
import { AuthDTO } from '@app/common';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID')
    );
  }

  // async validateUser(email: string, password: string): Promise<any> {
  //   try {
  //     return await this.userService.ValidateUser({ email, password });
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  // }

  async login(request: AuthDTO.LoginRequest): Promise<AuthDTO.LoginResponse> {
    try {
      const user = await this.userService.ValidateUser({
        email: request.email,
        password: request.password
      });

      const tokens = await this.generateTokens(user);
      return {
        status: {
          code: 200,
          message: 'Login successful'
        },
        data: tokens
      };
    } catch (error) {
      return {
        status: {
          code: 401,
          message: 'Invalid credentials',
          error: error.error
        }
      };
    }
  }

  async refreshToken(request: AuthDTO.RefreshTokenRequest): Promise<AuthDTO.RefreshTokenResponse> {
    try {
      // Verify JWT signature
      try {
        this.jwtService.verify(request.refreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
      } catch (jwtError) {
        return {
          status: {
            code: 401,
            message: 'Invalid refresh token format'
          }
        };
      }

      // Check if token exists in Redis
      const userId = await this.redisService.get(`refresh_token:${request.refreshToken}`);
      
      if (!userId) {
        return {
          status: {
            code: 401,
            message: 'Invalid or revoked refresh token'
          }
        };
      }

      // Get the user and generate new tokens
      const user = await this.userService.GetUserById({ id: userId });
      
      // Delete the old refresh token
      await this.redisService.del(`refresh_token:${request.refreshToken}`);
      
      // Generate new tokens
      const tokens = await this.generateTokens(user);
      
      return {
        status: {
          code: 200,
          message: 'Tokens refreshed successfully'
        },
        data: tokens
      };
    } catch (error) {
      return {
        status: {
          code: 500,
          message: 'Failed to refresh tokens',
          error: error.message
        }
      };
    }
  }

  // async validateGoogleUser(profile: any): Promise<any> {
  //   try {
  //     const email = profile.emails[0].value;
  //     const displayName = profile.displayName || profile.name?.givenName || email.split('@')[0];
  //     const imageUrl = profile.photos?.[0]?.value;
      
  //     try {
  //       // Try to find existing user
  //       const user = await this.userService.GetUserByEmail({ email });
  //       return user;
  //     } catch (err) {
  //       // User doesn't exist, create a new one
  //       const newUser = await this.userService.CreateUser({
  //         email,
  //         password: uuidv4(), // Generate random password
  //         username: displayName,
  //         // image: imageUrl || '',
  //       });
        
  //       return newUser;
  //     }
  //   } catch (error) {
  //     throw new UnauthorizedException('Could not validate Google user');
  //   }
  // }

  // async googleLogin(request: AuthDTO.GoogleLoginRequest): Promise<AuthDTO.LoginResponse> {
  //   try {
  //     let user;
      
  //     try {
  //       user = await this.userService.GetUserByEmail({ email: request.email });
  //     } catch (err) {
  //       // User doesn't exist, create a new one
  //       user = await this.userService.CreateUser({
  //         email: request.email,
  //         password: uuidv4(), // Generate random password
  //         username: request.displayName,
  //       });
  //     }
      
  //     const tokens = await this.generateTokens(user);
      
  //     return {
  //       status: {
  //         code: 200,
  //         message: 'Google login successful'
  //       },
  //       data: tokens
  //     };
  //   } catch (error) {
  //     return {
  //       status: {
  //         code: 500,
  //         message: 'Failed to authenticate with Google',
  //         error: error.error
  //       }
  //     };
  //   }
  // }

  async validateGoogleToken(request: AuthDTO.GoogleTokenRequest): Promise<AuthDTO.LoginResponse> {
    try {
      // Verify the Google token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: request.token,
        audience: this.configService.get('GOOGLE_CLIENT_ID')
      });
      
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return {
          status: {
            code: 400,
            message: 'Invalid Google token'
          }
        };
      }
      
      // Check if user exists
      let user;
      
      try {
        user = await this.userService.GetUserByEmail({ email: payload.email });
      } catch (err) {
        // User doesn't exist, create a new one
        user = await this.userService.CreateUser({
          email: payload.email,
          password: uuidv4(), // Generate random password
          username: payload.name || payload.email.split('@')[0],
          // image: payload.picture || '',
        });
      }
      
      // Generate tokens
      const tokens = await this.generateTokens(user);
      
      return {
        status: {
          code: 200,
          message: 'Google authentication successful'
        },
        data: tokens
      };
    } catch (error) {
      return {
        status: {
          code: 500,
          message: 'Failed to authenticate with Google',
          error: error.message
        }
      };
    }
  }

  async logout(request: AuthDTO.RefreshTokenRequest): Promise<AuthDTO.LogoutResponse> {
    try {
      // Delete the refresh token from Redis
      await this.redisService.del(`refresh_token:${request.refreshToken}`);
      
      return {
        status: {
          code: 200,
          message: 'Logout successfully'
        }
      };
    } catch (error) {
      return {
        status: {
          code: 500,
          message: 'Failed to logout'
        }
      };
    }
  }

  async verifyToken(request: AuthDTO.VerifyTokenRequest): Promise<AuthDTO.VerifyTokenResponse> {
    try {
      const payload = this.jwtService.verify(request.token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      
      return {
        status: {
          code: 200,
          message: 'Token is valid'
        },
        data: payload,
      };
    } catch (error) {
      return {
        status: {
          code: 401,
          message: 'Invalid token'
        },
      };
    }
  }

  private async generateTokens(user: any): Promise<AuthDTO.TokenData> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles || ['user'],
    };

    // Generate tokens
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') || '15m',
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );

    // Store refresh token in Redis with expiration
    const refreshExpiration = parseInt(this.configService.get('JWT_REFRESH_EXPIRATION_SECONDS') || '604800', 10);
    await this.redisService.set(
      `refresh_token:${refreshToken}`, 
      user.id, 
      'EX', 
      refreshExpiration
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: parseInt(this.configService.get('JWT_ACCESS_EXPIRATION_SECONDS') || '900', 10),
    };
  }
}