import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Color } from "src/common/types/color.type";

export class CreateBoardDto {
    @IsNotEmpty({ message: '보드이름을 입력해주세요.'})
    @ApiProperty({
        example: '오늘 할일',
        description: "보드 설명란",
        required: true,
    })
    title: string


    @IsNotEmpty({ message: '색을 입력해주세요.'})
    @ApiProperty({
        example: '색',
        description: "색을 고르삼",
        required: true,
    })
    color: Color

    @IsNotEmpty({ message: '보드에 대한 설명을 입력해주세요.'})
    @ApiProperty({
        example: '하루의 일기를 저장하는 일기입니다.',
        description: "설명하셈",
        required: true,
    })
    description: string
}
