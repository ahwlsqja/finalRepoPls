import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Color } from "src/common/types/color.type";

export class CreateCardDto {

    @IsString()
    @IsNotEmpty({ message: '카드 제목을 입력해주세요.' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: '카드 색상을 입력해주세요.' })
    color: Color;

    @IsString()
    @IsNotEmpty({ message: '카드 내용을 입력해주세요.' })
    content: string;

    @IsNotEmpty({ message: '카드 만료 일자를 입력해주세요.' })
    endDate: Date;

  }