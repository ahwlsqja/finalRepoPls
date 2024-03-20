import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class InvitationDto {
    @IsNotEmpty({ message: '이메일을 입력해주세요.'})
    @ApiProperty({
        example: 'ahddafasfe@fdaf.com',
        description: '이메일',
        required: true,
    })
    memberEmail: string
}