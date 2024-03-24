import { PartialType } from "@nestjs/mapped-types";
import { CreateCheckCurrentDto } from "./create-checkCurrent.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CurrentStatus } from "../types/checkCurrent-status.type";


export class UpdateCheckCurrentDto {

    @ApiProperty({
        example: "TIL 쓰기",
        description: "해야할 일의 내용 수정",
      })

    @IsString()
    @IsNotEmpty({ message: "할 일 내용을 입력해주세요." })
    @MaxLength(20, { message: "할 일 내용은 20자 이하로 작성해주세요." })
    content: string;

    @ApiProperty({
        example: "Done",
        description: "해야할 일의 진행상태 수정",
      })

    @IsEnum(CurrentStatus, { message: "유효하지 않은 상태값입니다." })
    @IsNotEmpty({ message: "진행 상태를 입력해주세요." })
    status: CurrentStatus;

}
