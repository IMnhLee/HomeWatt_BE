import { UserDTO } from '@app/common';
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { handleMicroserviceResponse } from '@app/common';

@Injectable()
export class UserService implements OnModuleInit {
    private userService: UserDTO.UserServiceClient;

    constructor(@Inject('user') private client: ClientGrpc) {}
  
    onModuleInit() {
      this.userService =
        this.client.getService<UserDTO.UserServiceClient>(UserDTO.USER_SERVICE_NAME);
    }

    async GetUserById(id: UserDTO.UserIdRequest) {
        const response = await firstValueFrom(this.userService.getUserById(id));
        return handleMicroserviceResponse(response)
    };

    async GetUserByEmail(email: UserDTO.UserEmailRequest) {
        const response = await firstValueFrom(this.userService.getUserByEmail(email));
        return handleMicroserviceResponse(response)
    };

    async CreateUser(request: UserDTO.CreateUserRequest) {
        const response = await firstValueFrom(this.userService.createUser(request));
        return handleMicroserviceResponse(response)
    };

    async ValidateUser(request: UserDTO.ValidateUserRequest) {
        const response = await firstValueFrom(this.userService.validateUser(request));
        return handleMicroserviceResponse(response)
    }
}
