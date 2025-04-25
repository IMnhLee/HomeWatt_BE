import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Controller('user')
// @UseInterceptors(ResponseTransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers() {
      return this.userService.GetAllUsers();
    }
  
    @Get(':id')
    async getUserById(@Param() id: UserDTO.UserIdRequest) {
      return this.userService.GetUserById(id);
  
    }
  
    @Get('email/:email')
    async getUserByEmail(@Param() email: UserDTO.UserEmailRequest) {
      return this.userService.GetUserByEmail(email);
    }
    @Post('create')
    async createUser(@Body() request: UserDTO.CreateUserRequest) {
      return this.userService.CreateUser(request);
    }
    
    @Put(':id')
    async updateUser(@Param() id: UserDTO.UserIdRequest, @Body() request: UserDTO.UpdateUserData) {
      return this.userService.UpdateUser({ ...id, data: request });
    }
  
    @Delete(':id')
    async deleteUser(@Param() id: UserDTO.UserIdRequest) {
      return this.userService.DeleteUser(id);
    }
}
