import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {UserDTO} from '@app/common';

@Controller('user')
@UserDTO.UserServiceControllerMethods()
// @UsePipes(new ValidationPipe({ transform: true }))
export class UserController implements UserDTO.UserServiceController {
  constructor(
    private readonly userService: UserService,
  ) {}

  async getAllUsers(): Promise<UserDTO.UsersResponse> {
    try {
      const users = await this.userService.findAll();
      return {
        status: {
          code: 200,
          message: 'Get all users success',
        },
        data: users
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
        data: [],
      };
    }

  }

  async getUserById( id: UserDTO.UserIdRequest): Promise<UserDTO.UserResponse> {
    try {
      const user = await this.userService.findOneById(id);
      const { password, ...userWithoutPassword } = user;
      return {
        status: {
          code: 200,
          message: 'Get user by id success',
        },
        data: {
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
        },
      };
    }
  }

  async getUserByEmail(email: UserDTO.UserEmailRequest) {
    try {
      const user = await this.userService.findOneByEmail(email);
      const { password, ...userWithoutPassword } = user;
      return { 
        status: {
          code: 200,
          message: 'Get user by email success',
        },
        data: {
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
        },
      };
    }
  }
  async createUser(request: UserDTO.CreateUserRequest): Promise<UserDTO.UserResponse> {
    try {
      const user = await this.userService.create(request);
      const { password, ...userWithoutPassword } = user;
      return {
        status: {
          code: 200,
          message: 'Create user success',
        },
        data: {
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
        },
      };
    }
  }
  
  async updateUser(request: UserDTO.UpdateUserRequest): Promise<UserDTO.UserResponse> {
    try {
      console.log('Update user request:', request);
      const user = await this.userService.update(request);
      const { password, ...userWithoutPassword } = user;
      return {
        status: {
          code: 200,
          message: 'Success',
        },
        data: {
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
        },
      };
    }
  }

  async deleteUser(id: UserDTO.UserIdRequest): Promise<UserDTO.DeleteResponse> {
    try {
      const response = await this.userService.delete(id);
      return {
        status: {
          code: 200,
          message: response.message,
        },
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
      };
    }
  }

  async validateUser({ email, password }): Promise<UserDTO.ValidateUserResponse> {
    try {
      const user = await this.userService.findOneByEmail({email});
      if (user.active === false) {
        return {
          status: {
            code: 403,
            message: 'User is inactive',
          },
        };
      }
      await this.userService.validatePassword(user, password);
      // Loại bỏ password
      const { password: _, ...userWithoutPassword } = user;
      return {
        status: {
          code: 200,
          message: 'User is valid',
        },
        data: {
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
        },
      };
    }
  }

  async updateUserPassword(request: UserDTO.UpdateUserPasswordRequest): Promise<UserDTO.UserResponse> {
    try {
      const { id, ...updatePasswordRequest } = request;
      const user = await this.userService.updatePassword( {id}, updatePasswordRequest);
      const { password, ...userWithoutPassword } = user;
      return {
        status: {
          code: 200,
          message: 'Update password success',
        },
        data: {
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
        },
      };
    }
  }

  async forgotPassword(request: UserDTO.ForgotPasswordRequest): Promise<UserDTO.ForgotPasswordResponse> {
    try {
      const response = await this.userService.forgotPassword(request);
      return {
        status: {
          code: 200,
          message: response.message,
        },
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
      };
    }
  }

  async resetPassword(request: UserDTO.ResetPasswordRequest): Promise<UserDTO.ResetPasswordResponse> {
    try {
      const response = await this.userService.resetPassword(request.token, request.email, request.password);
      return {
        status: {
          code: 200,
          message: response.message,
        },
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
      };
    }
  }

  async manageUser(request: UserDTO.ManageUserRequest): Promise<UserDTO.ManageUserResponse> {
    try {
      const { userId, active } = request;
      const response = await this.userService.manageUser(userId, active);
      return {
        status: {
          code: 200,
          message: response.message,
        },
        data: response.user,
      };
    }
    catch (error) {
      return {
        status: {
          code: error.status || 500,
          message: error.message,
          error: error.error || 'Internal Server Error',
        },
      };
    }
  }
}
