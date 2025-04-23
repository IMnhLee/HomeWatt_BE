import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserServiceController, UserIdRequest, UserEmailRequest, CreateUserRequest, UpdateUserRequest, UserResponse, UsersResponse, UserServiceControllerMethods, DeleteResponse, ValidateUserResponse} from '@app/common';

@Controller('user')
@UserServiceControllerMethods()
// @UsePipes(new ValidationPipe({ transform: true }))
export class UserController implements UserServiceController {
  constructor(
    private readonly userService: UserService,
  ) {}

  async getAllUsers(): Promise<UsersResponse> {
    try {
      const users = await this.userService.findAll();
      return {
        status: {
          code: 200,
          message: 'Get all users success',
          timestamp: new Date().toISOString(),
        },
        users: users.map(({ password, ...user }) => ({
        ...user,
        createdAt: user.createdAt ? user.createdAt.toISOString() : '',
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
        }))
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
        users: [],
      };
    }

  }

  async getUserById( id: UserIdRequest): Promise<UserResponse> {
    try {
      const user = await this.userService.findOneById(id);
      const { password, ...userWithoutPassword } = user;
      return {
        status: {
          code: 200,
          message: 'Get user by id success',
          timestamp: new Date().toISOString(),
        },
        user: {
        ...userWithoutPassword,
        createdAt: user.createdAt ? user.createdAt.toISOString() : '',
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
        } 
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  async getUserByEmail(email: UserEmailRequest) {
    try {
      const user = await this.userService.findOneByEmail(email);
      const { password, ...userWithoutPassword } = user;
      return { 
        status: {
          code: 200,
          message: 'Get user by email success',
          timestamp: new Date().toISOString(),
        },
        user: {
        ...userWithoutPassword,
        createdAt: user.createdAt ? user.createdAt.toISOString() : '',
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
        } 
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    try {
      const user = await this.userService.create(request);
      const { password, ...userWithoutPassword } = user;
      return {
        status: {
          code: 200,
          message: 'Create user success',
          timestamp: new Date().toISOString(),
        },
        user: {
        ...userWithoutPassword,
        createdAt: user.createdAt ? user.createdAt.toISOString() : '',
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
        } 
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
  
  async updateUser(request: UpdateUserRequest): Promise<UserResponse> {
    try {
      const user = await this.userService.update(request);
      const { password, ...userWithoutPassword } = user;
      return {
        status: {
          code: 1,
          message: 'Success',
          timestamp: new Date().toISOString(),
        },
        user: {
        ...userWithoutPassword,
        createdAt: user.createdAt ? user.createdAt.toISOString() : '',
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
        } 
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  async deleteUser(id: UserIdRequest): Promise<DeleteResponse> {
    try {
      const response = await this.userService.delete(id);
      return {
        status: {
          code: 200,
          message: response.message,
          timestamp: new Date().toISOString(),
        },
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  async validateUser({ email, password }): Promise<ValidateUserResponse> {
    try {
      const user = await this.userService.findOneByEmail(email);
      await this.userService.validatePassword(user, password);
      // Loại bỏ password
      const { password: _, ...userWithoutPassword } = user;
      return {
        status: {
          code: 200,
          message: 'User is valid',
          timestamp: new Date().toISOString(),
        },
        user: {
        ...userWithoutPassword,
        createdAt: user.createdAt ? user.createdAt.toISOString() : '',
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
        },
      };
    } catch (error) {
      console.error('Error validating user:', error);
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
