import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {

    @ApiProperty({
        example: "sample@gmail.com",
        description: "가입할 이메일 주소",
    })

    @IsEmail()
    @IsNotEmpty({ message : "이메일을 기재 해주세요." })
    email : string

    @ApiProperty({
        example: "aabb1122",
        description: "비밀번호",
    })

    @IsString()
    @IsNotEmpty({ message : "패스워드를 기재 해주세요." })
    password : string

    @ApiProperty({
        example: "aabb1122",
        description: "비밀번호 확인",
    })

    @IsString()
    @IsNotEmpty({ message : "패스워드 확인을 기재 해주세요." })
    passwordConfirm : string

    @ApiProperty({
        example: "이하이",
        description: "이름",
    })

    @IsString()
    @IsNotEmpty({ message : "이름을 기재 해주세요." })
    name : string
    
    @ApiProperty({
        example: "",
        description: "사내 어드민에게만 허용되는 고유한 SSHKEY",
        required: false
    })

    @IsString()
    @IsOptional()
    sshKey? : string

}