import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsNumber()
  cardId: number;

  @IsString()
  @IsNotEmpty({ message: "댓글 내용을 입력해주세요." })
  @MaxLength(50, { message: "댓글은 50자 이하로 작성해주세요." })
  content: string;
}
