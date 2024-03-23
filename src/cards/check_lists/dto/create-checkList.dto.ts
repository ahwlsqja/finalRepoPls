import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateCheckListDto {
    @IsString()
    @IsNotEmpty({ message: "댓글 내용을 입력해주세요." })
    @MaxLength(20, { message: "댓글은 20자 이하로 작성해주세요." })
    title: string;
}
