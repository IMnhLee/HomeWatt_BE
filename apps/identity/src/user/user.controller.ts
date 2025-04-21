import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/createUser.request';
import { UserEmailParam } from './dto/userEmail.param';
import { UserIdParam } from './dto/userId.param';
import { UpdateUserRequest } from './dto/updateUser.request';
import { UserInfoResponse } from './dto/userInfo.response';
import { plainToInstance } from 'class-transformer';
import { RmqService } from '@app/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('user')
// @UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rmqService: RmqService
  ) {}

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

  @MessagePattern('validate_user')
  async validateUser(
    @Payload() data: { email: string; password: string },
    @Ctx() context: RmqContext,
  ) {
    const { email, password } = data;
    try {
      const user = await this.userService.findOneByEmail({ email });
      // if (!user) return null;
      
      const isPasswordValid = await this.userService.validatePassword(user, password);
      if (!isPasswordValid) return null;
      
      const { password: _, ...result } = user;
      this.rmqService.ack(context);
      return result;
    } catch (error) {
      this.rmqService.ack(context);
      return null;
    }
  }

  @MessagePattern('find_user_by_id')
  async findUserById(
    @Payload() userId: string,
    @Ctx() context: RmqContext,
  ) {
    try {
      const user = await this.userService.findOneById({ id: userId });
      const { password: _, ...result } = user;
      this.rmqService.ack(context);
      return result;
    } catch (error) {
      this.rmqService.ack(context);
      return null;
    }
  }

  @MessagePattern('find_user_by_email')
  async findUserByEmail(
    @Payload() email: string,
    @Ctx() context: RmqContext,
  ) {
    try {
      const user = await this.userService.findOneByEmail({ email });
      const { password: _, ...result } = user;
      this.rmqService.ack(context);
      return result;
    } catch (error) {
      this.rmqService.ack(context);
      return null;
    }
  }
}
