import { PartialType } from "@nestjs/mapped-types";
import { CreateCardDto } from "./create-card.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCardDto extends PartialType(CreateCardDto) {
    @IsString()
    @IsNotEmpty({ message: ' 제목을 입력해주세요.' })
    title: string;
  
    @IsString()
    @IsNotEmpty({ message: '내용을 입력해주세요.' })
    content: string;
}
