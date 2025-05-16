import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('user')
// @UseInterceptors(ResponseTransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUsers() {
      return this.userService.GetAllUsers();
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param() id: UserDTO.UserIdRequest, @CurrentUser() user) {
      return this.userService.GetUserById(id, user);
  
    }
  
    @Get('email/:email')
    @UseGuards(JwtAuthGuard)
    async getUserByEmail(@Param() email: UserDTO.UserEmailRequest) {
      return this.userService.GetUserByEmail(email);
    }

    @Public()
    @Post('create')
    async createUser(@Body() request: UserDTO.CreateUserRequest) {
      return this.userService.CreateUser(request);
    }
    
    
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param() id: UserDTO.UserIdRequest, @Body() request: UserDTO.UpdateUserData) {
      return this.userService.UpdateUser({ ...id, data: request });
    }
  
    @Delete(':id')
    @UseGuards(AdminRoleGuard)
    async deleteUser(@Param() id: UserDTO.UserIdRequest) {
      return this.userService.DeleteUser(id);
    }

    @Post('update-password')
    @UseGuards(JwtAuthGuard)
    async updateUserPassword(@Body() request: UserDTO.UpdateUserPasswordRequest, @CurrentUser() user) {
      return this.userService.UpdateUserPassword({ ...request, id: user.id });
    }

    @Post('forgot-password')
    @Public()
    async forgotPassword(@Body() request: UserDTO.ForgotPasswordRequest) {
      return this.userService.ForgotPassword(request);
    }
    @Post('reset-password')
    @Public()
    async resetPassword(@Body() request: UserDTO.ResetPasswordRequest) {
      return this.userService.ResetPassword(request);
    }
}
