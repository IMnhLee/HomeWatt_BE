import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import {UserDTO} from '@app/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.findAll();
    // return result.map((user) => {
    //   const { password, ...userWithoutPassword } = user;
    //   return userWithoutPassword;
    // });
  }

  async findOneByEmail(email: UserDTO.UserEmailRequest) {
    try {
      this.logger.log(`Finding user by email: ${email}`);
      return this.userRepository.findOneBy({ where: email });
    }
    catch (error) {
      throw new NotFoundException('User not found.');
    }
  }

  async findOneById(id: UserDTO.UserIdRequest) {
    try {
      return this.userRepository.findOneById(id.id);
    }
    catch (error) {
      console.log(error);
      throw new NotFoundException('User not found.');
    }
  }

  async create(request: UserDTO.CreateUserRequest) {
    // kiểm tra email đã tồn tại chưa
    let foundUser: User | null = null;
    try {
      foundUser = await this.userRepository.findOneBy({where: { email: request.email }});
    }
    catch (error) {}

    if (foundUser) {
      throw new ConflictException('Email already exists.');
    }
    const newUser = await this.userRepository.create({
      ...request,
      password: await bcrypt.hash(request.password, 10),
    });

    return newUser;
  }
  async update(request: UserDTO.UpdateUserRequest) {
    const { id, data } = request;
    try {
      return this.userRepository.update(id, 
        {
          ...data
        }
      );
  }
    catch (error) {
      throw new BadRequestException('Invalid data provided.');
    }
  }
  async delete(id: UserDTO.UserIdRequest) {
    const result = await this.userRepository.delete(id.id);
    if (!result) {
      throw new NotFoundException('User not found.');
    }
    return {
      deleted: true,
      message: 'User deleted successfully.',
    }
  }

  async validatePassword(user: User, password: string) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password.');
    }
    return true;
  }

  // async getAllGroupOfUser(id: UserIdParam) {
  //   try {
  //     const user = await this.userRepository.findOneById(id.id, { relations: ['groups'] });
  //     if (!user) {
  //       throw new NotFoundException('User not found.');
  //     }
  //     return user.groups;
  //   } catch (error) {
  //     throw new UnprocessableEntityException('Failed to get groups of user.');
  //   }
  // }
}
