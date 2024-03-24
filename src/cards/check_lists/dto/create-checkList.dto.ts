import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateCheckListDto {

    @ApiProperty({
        example: "제목: 첫번째 체크리스트",
        description: "체크리스트 제목",
      })
      
    @IsString()
    @IsNotEmpty({ message: "체크리스트 제목을 입력해주세요." })
    @MaxLength(20, { message: "제목은 20자 이하로 작성해주세요." })
    title: string;
}
