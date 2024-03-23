import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { CurrentStatus } from "../types/checkCurrent-status.type";

export class CreateCheckCurrentDto {

    @IsString()
    @IsNotEmpty({ message: "할 일 내용을 입력해주세요." })
    @MaxLength(20, { message: "할 일 내용은 20자 이하로 작성해주세요." })
    content: string;

    @IsEnum(CurrentStatus, { message: "유효하지 않은 상태값입니다." })
    @IsNotEmpty({ message: "진행 상태를 입력해주세요." })
    status: CurrentStatus;

}
