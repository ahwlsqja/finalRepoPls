import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PickType(CreateUserDto, ['name']) {

    @ApiProperty({
        example: "이하이",
        description: "회원 이름",
    })

    @IsString()
    @IsNotEmpty({ message : "이름을 기재 해주세요." })
    name : string

}
