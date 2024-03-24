import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator"

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty({ message : "이메일을 기재 해주세요." })
    email : string

    @ApiProperty({
        example: "aabb1122",
        description: "비밀번호",
    })
    @IsString()
    @MinLength(8, {
        message: "비밀번호는 8자리 이상이어야 합니다.",
    })
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: "비밀번호는 영어와 숫자만 포함될 수 있습니다.",
    })
    @IsNotEmpty({ message : "패스워드를 기재 해주세요." })
    password : string

    @IsString()
    @IsNotEmpty({ message : "패스워드 확인을 기재 해주세요." })
    passwordConfirm : string

    @IsString()
    @IsNotEmpty({ message : "이름을 기재 해주세요." })
    name : string

    @IsString()
    @IsOptional()
    sshKey? : string
    
}