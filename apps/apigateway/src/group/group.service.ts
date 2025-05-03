import { GroupDTO, handleMicroserviceResponse } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GroupService implements OnModuleInit {
    private groupService: GroupDTO.GroupServiceClient;

    constructor(@Inject('group') private client: ClientGrpc) {}

    onModuleInit() {
        this.groupService =
            this.client.getService<GroupDTO.GroupServiceClient>(GroupDTO.GROUP_SERVICE_NAME);
    }

    async GetAllGroups(request: GroupDTO.GetAllGroupsRequest) {
        const response = await firstValueFrom(this.groupService.getAllGroups(request));
        return handleMicroserviceResponse(response);
    };

    async GetGroupById(request: GroupDTO.GroupIdRequest) {
        const response = await firstValueFrom(this.groupService.getGroupById(request));
        return handleMicroserviceResponse(response);
    };

    async CreateGroup(request: GroupDTO.CreateGroupRequest) {
        const response = await firstValueFrom(this.groupService.createGroup(request));
        return handleMicroserviceResponse(response);
    };

    async UpdateGroup(request: GroupDTO.UpdateGroupRequest) {
        const response = await firstValueFrom(this.groupService.updateGroup(request));
        return handleMicroserviceResponse(response);
    };

    async DeleteGroup(id: GroupDTO.GroupIdRequest) {
        const response = await firstValueFrom(this.groupService.deleteGroup(id));
        return handleMicroserviceResponse(response);
    };

}
