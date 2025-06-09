import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ManageUserDto } from './dto/manageUser.dto';
import { UserIdDto } from './dto/userId.dto';

@Controller('user')
// @UseInterceptors(ResponseTransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AdminRoleGuard)
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
    async updateUser(@CurrentUser() user, @Body() request: UserDTO.UpdateUserData) {
      return this.userService.UpdateUser({ id: user.id, data: request });
    }
  
    @Delete(':id')
    @UseGuards(AdminRoleGuard)
    async deleteUser(@Param() id: UserIdDto, @CurrentUser() admin) {
      if (id.id === admin.id) {
        throw new ForbiddenException('You cannot delete your own account.');
      }
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

    @Put('manage-active/:id')
    @UseGuards(AdminRoleGuard)
    async manageActiveUser(@Param() id: UserIdDto, @Body() request: ManageUserDto, @CurrentUser() admin) {
    if (id.id === admin.id) {
      throw new ForbiddenException('You cannot change your own status.');
    }
    return this.userService.ManageUser({ userId: id.id, ...request });
  }
}