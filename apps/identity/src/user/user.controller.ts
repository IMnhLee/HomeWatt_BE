import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/createUser.request';
import { UserEmailParam } from './dto/userEmail.param';
import { UserIdParam } from './dto/userId.param';
import { UpdateUserRequest } from './dto/updateUser.request';

@Controller('user')
// @UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param() id: UserIdParam) {
    return this.userService.findOneById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param() email: UserEmailParam) {
    return this.userService.findOneByEmail(email);
  }
  @Post('create')
  async createUser(@Body() request: CreateUserRequest) {
    return this.userService.create(request);
  }
  
  @Put(':id')
  async updateUser(@Param() id: UserIdParam, @Body() request: UpdateUserRequest) {
    return this.userService.update(id, request);
  }

  @Delete(':id')
  async deleteUser(@Param() id: UserIdParam) {
    return this.userService.delete(id);
  }
}
