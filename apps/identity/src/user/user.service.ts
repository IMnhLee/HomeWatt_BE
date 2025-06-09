import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {UserDTO} from '@app/common';
import { UpdatePasswordRequest } from './dto/updatePasssword.request';
import { ClientProxy } from '@nestjs/microservices';
import { MonitoringService } from '../monitoring/monitoring.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly monitoringService: MonitoringService,
    @Inject("MAIL") private mailClient: ClientProxy,
  ) {}

async findAll() {
  const users = await this.userRepository.findAll();
  
  const usersWithMonitoring = await Promise.all(
    users.map(async (user) => {
      // Get monitoring data for this user
      const monitoringData = await this.monitoringService.getUserMonitoring(user.id);
      
      // Return user with their monitoring data in the format matching the proto definition
      return {
        user: {
          ...user,
          createdAt: user.createdAt ? user.createdAt.toISOString() : '',
          updatedAt: user.updatedAt ? user.updatedAt.toISOString() : ''
        },
        monitoring: monitoringData.data
      };
    })
  );
  
  return usersWithMonitoring;
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

  async updatePassword(id: UserDTO.UserIdRequest, request: UpdatePasswordRequest) {
    const { password, currentPassword } = request;
    const user = await this.userRepository.findOneById(id.id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid current password.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.userRepository.update(id.id, { password: hashedPassword });
    if (!result) {
      throw new NotFoundException('User not found.');
    }
    return result;
  }

  async forgotPassword(email: UserDTO.UserEmailRequest) {
    const user = await this.userRepository.findOneBy({ where: email });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.active === false) {
      throw new UnprocessableEntityException('User is inactive.');
    }
    if (user.googleId) {
      throw new UnprocessableEntityException('User registered with Google. Cannot reset password.');
    }

    try {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(resetToken, 10);

      const expireTime = new Date();
      expireTime.setMinutes(expireTime.getMinutes() + 15); // Token expires in 15 minutes

      await this.userRepository.update(
        user.id,
        {
          emailCode: hashedToken,
          emailCodeExpire: expireTime,
        }
      );

      this.mailClient.emit('send_forgot_password_mail', {
        email: user.email,
        resetToken,
        username: user.username,
      });

      return {
        message: 'Reset password email sent successfully.',
      }
    }
    catch (error) {
      this.logger.error(`Error in forgotPassword: ${error.message}`);
      throw new NotFoundException('User not found.');
    }
  }

  async resetPassword(token: string, email:string, password: string) {
    
    const user = await this.userRepository.findOneBy({ where: { email: email } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.active === false) {
      throw new UnprocessableEntityException('User is inactive.');
    }

    const isTokenValid = await bcrypt.compare(token, user.emailCode);

    if (!isTokenValid) {
      throw new UnprocessableEntityException('Invalid token.');
    }

    if (user.emailCodeExpire < new Date()) {
      throw new UnprocessableEntityException('Token expired.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const expireTime = new Date();
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      emailCode: "",
      emailCodeExpire: expireTime,
    });

    return {
      message: 'Password reset successfully.',
    }
  }

  async manageUser(userId, active: boolean) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    
    // if (user.googleId) {
    //   throw new UnprocessableEntityException('Cannot change status of Google registered user.');
    // }

    const updatedUser = await this.userRepository.update(userId, { active });
    
    if (!updatedUser) {
      throw new NotFoundException('User not found.');
    }

    return {
      message: `User ${active ? 'activated' : 'deactivated'} successfully.`,
      user: {
          ...updatedUser,
          createdAt: updatedUser.createdAt ? updatedUser.createdAt.toISOString() : '',
          updatedAt: updatedUser.updatedAt ? updatedUser.updatedAt.toISOString() : ''
        },
    };

  }
    
}
