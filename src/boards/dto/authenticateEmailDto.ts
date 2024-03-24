import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthenticateDto {
    @ApiProperty({
        example: 'sample@gmail.com',
        description: '가입한 이메일',
        required: true,
    })
    @IsNotEmpty({ message: '이메일을 입력해주세요.'})
    memberEmail: string


    @ApiProperty({
        example: '413131',
        description: 'sample@gmail.com에 발송되는 인증번호를 입력',
        required: true,
    })
    @IsNotEmpty({ message: '인증번호를 입력해주세요.'})
    authenticateEmailCode: string
}