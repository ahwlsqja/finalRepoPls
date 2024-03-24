import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Color } from "src/common/types/color.type";

export class CreateBoardDto {
    @ApiProperty({
        example: 'OO팀 칸반 보드',
        description: "보드 제목",
        required: true,
    })
    @IsNotEmpty({ message: '보드 이름을 입력해주세요.'})
    title: string


    @ApiProperty({
        example: 'BLACK',
        description: "보드 색상",
        required: true,
    })
    @IsNotEmpty({ message: '보드의 색상을 입력해주세요.'})
    color: Color

    @ApiProperty({
        example: '이 보드는 OO팀을 위한 칸반 보드입니다.',
        description: "보드 설명",
        required: true,
    })
    @IsNotEmpty({ message: '보드에 대한 설명을 입력해주세요.'})
    description: string
}
