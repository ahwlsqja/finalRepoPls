import { PartialType } from "@nestjs/mapped-types";
import { CreateCheckListDto } from "./create-checkList.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";


export class UpdateCheckListDto {

    @ApiProperty({
        example: "제목: 수정된 첫번째 체크리스트",
        description: "수정할 체크리스트 제목",
      })
      
    @IsString()
    @IsNotEmpty({ message: "체크리스트 제목을 입력해주세요." })
    @MaxLength(20, { message: "제목은 20자 이하로 작성해주세요." })
    title: string;
}
