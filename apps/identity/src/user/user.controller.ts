import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/createUser.request';
import { UserEmailParam } from './dto/userEmail.param';
import { UserIdParam } from './dto/userId.param';
import { UpdateUserRequest } from './dto/updateUser.request';
import { UserInfoResponse } from './dto/userInfo.response';
import { plainToInstance } from 'class-transformer';

@Controller('user')
// @UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    const users = await this.userService.findAll();
    return plainToInstance(UserInfoResponse, users);
  }

  @Get(':id')
  async getUserById(@Param() id: UserIdParam) {
    const user = await this.userService.findOneById(id);
    return plainToInstance(UserInfoResponse, user);

  }

  @Get('email/:email')
  async getUserByEmail(@Param() email: UserEmailParam) {
    const user = await this.userService.findOneByEmail(email);
    return plainToInstance(UserInfoResponse, user);
  }
  @Post('create')
  async createUser(@Body() request: CreateUserRequest) {
    const user = await this.userService.create(request);
    return plainToInstance(UserInfoResponse, user);
  }
  
  @Put(':id')
  async updateUser(@Param() id: UserIdParam, @Body() request: UpdateUserRequest) {
    const user = await this.userService.update(id, request);
    return plainToInstance(UserInfoResponse, user);
  }

  @Delete(':id')
  async deleteUser(@Param() id: UserIdParam) {
    return this.userService.delete(id);
  }
}
