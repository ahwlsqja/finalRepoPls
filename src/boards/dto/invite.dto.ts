import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class InvitationDto {
    @ApiProperty({
        example: 'sample@gmail.com',
        description: '초대할 회원의 이메일',
        required: true,
    })
    @IsNotEmpty({ message: '초대할 회원의 이메일을 입력해주세요.'})
    memberEmail: string
}