import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @ApiProperty({
      example: "sample@gmail.com",
      description: "로그인할 이메일 주소",
    })

    @IsEmail()
    @IsNotEmpty({ message: '이메일을 입력해주세요.' })
    email: string;
  
    @ApiProperty({
      example: "aabb1122",
      description: "비밀번호",
    })  

    @IsString()
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    password: string;
  }