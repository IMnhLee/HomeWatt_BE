import { UserDTO } from '@app/common';
import { ForbiddenException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { handleMicroserviceResponse } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
    private userService: UserDTO.UserServiceClient;

    constructor(@Inject('user') private client: ClientGrpc) {}
  
    onModuleInit() {
      this.userService =
        this.client.getService<UserDTO.UserServiceClient>(UserDTO.USER_SERVICE_NAME);
    }

    async GetAllUsers() {
        const response = await firstValueFrom(this.userService.getAllUsers({}));
        return handleMicroserviceResponse(response);
    };

    async GetUserById(id: UserDTO.UserIdRequest, user: any) {
        if (user.role !== 'admin' && user.id !== id.id) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }
        const response = await firstValueFrom(this.userService.getUserById(id));
        return handleMicroserviceResponse(response);
    };

    async GetUserByEmail(email: UserDTO.UserEmailRequest) {
        const response = await firstValueFrom(this.userService.getUserByEmail(email));
        return handleMicroserviceResponse(response);
    };

    async CreateUser(request: UserDTO.CreateUserRequest) {
        const response = await firstValueFrom(this.userService.createUser(request));
        return handleMicroserviceResponse(response);
    };

    async UpdateUser(request: UserDTO.UpdateUserRequest) {
        const response = await firstValueFrom(this.userService.updateUser(request));
        return handleMicroserviceResponse(response);
    };

    async DeleteUser(id: UserDTO.UserIdRequest) {
        const response = await firstValueFrom(this.userService.deleteUser(id));
        return handleMicroserviceResponse(response);
    };

    async UpdateUserPassword(request: UserDTO.UpdateUserPasswordRequest) {
        const response = await firstValueFrom(this.userService.updateUserPassword(request));
        return handleMicroserviceResponse(response);
    }

    async ForgotPassword(request: UserDTO.ForgotPasswordRequest) {
        const response = await firstValueFrom(this.userService.forgotPassword(request));
        return handleMicroserviceResponse(response);
    }

    async ResetPassword(request: UserDTO.ResetPasswordRequest) {
        const response = await firstValueFrom(this.userService.resetPassword(request));
        return handleMicroserviceResponse(response);
    }

    async ManageUser(request: UserDTO.ManageUserRequest) {
        const response = await firstValueFrom(this.userService.manageUser(request));
        return handleMicroserviceResponse(response);
    }
}
