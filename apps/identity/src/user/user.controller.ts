import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/createUser.request';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }
  @Post('create')
  async createUser(@Body() request: CreateUserRequest) {
    return this.userService.create(request);
  }
}
