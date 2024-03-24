import { PartialType } from "@nestjs/mapped-types";
import { CreateCardDto } from "./create-card.dto";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Color } from "src/common/types/color.type";
import { Tag } from "../types/tag.type";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCardDto extends PartialType(CreateCardDto) {

    @ApiProperty({
        example: "(긴급) 서버 배포 전 테스트 코드 수정",
        description: "수정할 카드 제목",
    })

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: '카드 제목을 입력해주세요.' })
    title?: string;

    @ApiProperty({
        example: "RED",
        description: "수정할 카드 색상",
    })

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: '카드 색상을 입력해주세요.' })
    color?: Color;

    @ApiProperty({
        example: "AWS EC2 배포하기 X -> 테스트 코드 이상 있음 -> 수정 후 다시 배포하기",
        description: "수정할 카드 내용",
    })

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: '카드 내용을 입력해주세요.' })
    content?: string;
    @IsOptional()
    @IsEnum(Tag, { message: '유효하지 않은 부서 입니다. 다시 입력해주세요'})
    @IsNotEmpty({ message: '부서를 입력해주세요.' })
    tag?: Tag;

    @ApiProperty({
        example: "2024-04-07",
        description: "수정할 카드 마감일",
    })

    @IsOptional()
    @IsNotEmpty({ message: '카드 만료 일자를 입력해주세요.' })
    endDate?: Date;
}
