import { CreateUserRequest, UpdateUserRequest, USER_SERVICE_NAME, UserEmailRequest, UserIdRequest, UserServiceClient } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UserService implements OnModuleInit {
    private userService: UserServiceClient;

    constructor(@Inject('user') private client: ClientGrpc) {}
  
    onModuleInit() {
      this.userService =
        this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    GetAllUsers() {
        return this.userService.getAllUsers({});
    };

    GetUserById(id: UserIdRequest) {
        return this.userService.getUserById(id);
    };

    GetUserByEmail(email: UserEmailRequest) {
        return this.userService.getUserByEmail(email);
    };

    CreateUser(request: CreateUserRequest) {
        return this.userService.createUser(request);
    };

    UpdateUser(request: UpdateUserRequest) {
        return this.userService.updateUser(request);
    };

    DeleteUser(id: UserIdRequest) {
        return this.userService.deleteUser(id);
    };
}
