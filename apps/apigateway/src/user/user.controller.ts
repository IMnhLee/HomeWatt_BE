import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest, UpdateUserData, UpdateUserRequest, UserEmailRequest, UserIdRequest } from '@app/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers() {
      return this.userService.GetAllUsers();
    }
  
    @Get(':id')
    async getUserById(@Param() id: UserIdRequest) {
      return this.userService.GetUserById(id);
  
    }
  
    @Get('email/:email')
    async getUserByEmail(@Param() email: UserEmailRequest) {
      return this.userService.GetUserByEmail(email);
    }
    @Post('create')
    async createUser(@Body() request: CreateUserRequest) {
      return this.userService.CreateUser(request);
    }
    
    @Put(':id')
    async updateUser(@Param() id: UserIdRequest, @Body() request: UpdateUserData) {
      return this.userService.UpdateUser({ ...id, data: request });
    }
  
    @Delete(':id')
    async deleteUser(@Param() id: UserIdRequest) {
      return this.userService.DeleteUser(id);
    }
}
