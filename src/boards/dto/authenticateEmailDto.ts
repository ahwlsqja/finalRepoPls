import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthenticateDto {
    @IsNotEmpty({ message: '이메일을 입력해주세요.'})
    @ApiProperty({
        example: 'ahddafasfe@fdaf.com',
        description: '이메일',
        required: true,
    })
    memberEmail: string


    @IsNotEmpty({ message: '인증번호를 입력해주세요.'})
    @ApiProperty({
        example: '413131',
        description: '인증번호',
        required: true,
    })
    authenticateEmailCode: string
}