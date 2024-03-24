import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class TokenDto {
    
    @ApiProperty({
        example: "sample@gmail.com",
        description: "인증할 이메일 주소",
    })
    
    @IsString()
    @IsNotEmpty({ message : "이메일이 입력되지 않았습니다." })
    readonly email : string;
    
    @ApiProperty({
        example: "2345",
        description: "이메일 주소로 발송된 인증 코드",
    })

    @IsString()
    @IsNotEmpty({ message : "이메일이 인증번호가 입력되지 않았습니다." })
    emailtoken : string;
}
