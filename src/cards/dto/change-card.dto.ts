import { IsNotEmpty, IsString } from "class-validator";

export class ChangeDto {
    @IsString()
    @IsNotEmpty({ message: '할당 태그를 입력해주세요.' })
    tag: number;
  }