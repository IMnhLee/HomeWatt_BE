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
    const users = await this.userService.findAll();
    return { 
      users: users.map(({ password, ...user }) => ({
      ...user,
      createdAt: user.createdAt ? user.createdAt.toISOString() : '',
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
      }))
    };
  }

  async getUserById( id: UserIdRequest): Promise<UserResponse> {
    const user = await this.userService.findOneById(id);
    const { password, ...userWithoutPassword } = user;
    return { 
      user: {
      ...userWithoutPassword,
      createdAt: user.createdAt ? user.createdAt.toISOString() : '',
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
      } 
    };
  }

  async getUserByEmail(email: UserEmailRequest) {
    const user = await this.userService.findOneByEmail(email);
    const { password, ...userWithoutPassword } = user;
    return { 
      user: {
      ...userWithoutPassword,
      createdAt: user.createdAt ? user.createdAt.toISOString() : '',
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
      } 
    };
  }
  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    const user = await this.userService.create(request);
    const { password, ...userWithoutPassword } = user;
    return { 
      user: {
      ...userWithoutPassword,
      createdAt: user.createdAt ? user.createdAt.toISOString() : '',
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
      } 
    };
  }
  
  async updateUser(request: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.userService.update(request);
    const { password, ...userWithoutPassword } = user;
    return { 
      user: {
      ...userWithoutPassword,
      createdAt: user.createdAt ? user.createdAt.toISOString() : '',
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
      } 
    };
  }

  async deleteUser(id: UserIdRequest): Promise<DeleteResponse> {
    return this.userService.delete(id);
  }

  async validateUser({ email, password }): Promise<ValidateUserResponse> {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user)
        return {
          isValid: false,
          message: 'User not found',
        }
      
      const isPasswordValid = await this.userService.validatePassword(user, password);
      if (!isPasswordValid)
        return {
          isValid: false,
          message: 'Invalid password',
        }
      
      // Loại bỏ password
      const { password: _, ...userWithoutPassword } = user;
      return {
        isValid: true,
        user: {
        ...userWithoutPassword,
        createdAt: user.createdAt ? user.createdAt.toISOString() : '',
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
        },
        message: 'User is valid',
      };
    } catch (error) {
      console.error('Error validating user:', error);
      return {
        isValid: false,
        message: 'An error occurred while validating the user',
      };
    }
  }
}
