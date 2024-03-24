import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty({ message: '이메일을 입력해주세요.' })
    email: string;
  
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
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    password: string;
    
  }