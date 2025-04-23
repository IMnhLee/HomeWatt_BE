import { UserDTO } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UserService implements OnModuleInit {
    private userService: UserDTO.UserServiceClient;

    constructor(@Inject('user') private client: ClientGrpc) {}
  
    onModuleInit() {
      this.userService =
        this.client.getService<UserDTO.UserServiceClient>(UserDTO.USER_SERVICE_NAME);
    }

    GetAllUsers() {
        return this.userService.getAllUsers({});
    };

    GetUserById(id: UserDTO.UserIdRequest) {
        return this.userService.getUserById(id);
    };

    GetUserByEmail(email: UserDTO.UserEmailRequest) {
        return this.userService.getUserByEmail(email);
    };

    CreateUser(request: UserDTO.CreateUserRequest) {
        return this.userService.createUser(request);
    };

    UpdateUser(request: UserDTO.UpdateUserRequest) {
        return this.userService.updateUser(request);
    };

    DeleteUser(id: UserDTO.UserIdRequest) {
        return this.userService.deleteUser(id);
    };
}
