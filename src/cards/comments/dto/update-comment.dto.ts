import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class UpdateCommentDto {

  @ApiProperty({
    example: "다시 생각해보니까 별로인 것 같아요...",
    description: "댓글 수정 내용",
  })

  @IsString()
  @IsNotEmpty({ message: "댓글 내용을 입력해주세요." })
  @MaxLength(50, { message: "댓글은 50자 이하로 작성해주세요." })
  content: string;

}
