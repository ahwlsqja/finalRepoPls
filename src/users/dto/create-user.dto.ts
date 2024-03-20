import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty({ message : "이메일을 기재 해주세요." })
    email : string

    @IsString()
    @IsNotEmpty({ message : "패스워드를 기재 해주세요." })
    password : string

    @IsString()
    @IsNotEmpty({ message : "패스워드 확인을 기재 해주세요." })
    passwordConfirm : string

    @IsString()
    @IsNotEmpty({ message : "이름을 기재 해주세요." })
    name : string

}