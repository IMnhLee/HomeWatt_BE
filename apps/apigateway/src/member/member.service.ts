import { handleMicroserviceResponse, MemberITF } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MemberService implements OnModuleInit {
    private memberService: MemberITF.MemberGroupServiceClient;
    constructor(@Inject('member_group') private client: ClientGrpc) {}
    onModuleInit() {
        this.memberService =
            this.client.getService<MemberITF.MemberGroupServiceClient>(MemberITF.MEMBER_GROUP_SERVICE_NAME);
    }
    async GetMemberByGroupId(request: MemberITF.GroupIdRequest) {
        const response = await firstValueFrom(this.memberService.getMembersByGroupId(request));
        return handleMicroserviceResponse(response);
    }

    async AddMemberToGroup(request: MemberITF.MemberRequest) {
        const response = await firstValueFrom(this.memberService.addMemberToGroup(request));
        return handleMicroserviceResponse(response);
    }

    async UpdateMemberRole(request: MemberITF.UpdateRoleRequest) {
        const response = await firstValueFrom(this.memberService.updateMemberRole(request));
        return handleMicroserviceResponse(response);
    }

    async RemoveMemberFromGroup(request: MemberITF.MemberRequest) {
        const response = await firstValueFrom(this.memberService.removeMemberFromGroup(request));
        return handleMicroserviceResponse(response);
    }
}
