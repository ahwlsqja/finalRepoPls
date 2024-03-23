import { IsNotEmpty, IsString } from "class-validator";


export class TokenDto {
    @IsString()
    @IsNotEmpty({ message : "이메일이 입력되지 않았습니다." })
    readonly email : string;
    
    @IsString()
    @IsNotEmpty({ message : "이메일이 인증번호가 입력되지 않았습니다." })
    emailtoken : string;
}
