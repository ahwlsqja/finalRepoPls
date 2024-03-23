import { PartialType } from "@nestjs/mapped-types";
import { CreateCardDto } from "./create-card.dto";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Color } from "src/common/types/color.type";
import { Tag } from "../types/tag.type";

export class UpdateCardDto extends PartialType(CreateCardDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: '카드 제목을 입력해주세요.' })
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: '카드 색상을 입력해주세요.' })
    color?: Color;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: '카드 내용을 입력해주세요.' })
    content?: string;
    
    @IsOptional()
    @IsEnum(Tag, { message: '유효하지 않은 부서 입니다. 다시 입력해주세요'})
    @IsNotEmpty({ message: '부서를 입력해주세요.' })
    tag?: Tag;

    @IsOptional()
    @IsNotEmpty({ message: '카드 만료 일자를 입력해주세요.' })
    endDate?: Date;
}
