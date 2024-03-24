import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateBoardDto } from "./create-board.dto";
import { IsOptional, IsString } from "class-validator";
import { Color } from "src/common/types/color.type";

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
    
    @ApiProperty({
        example: "OO팀 칸반 보드",
        description: "수정할 보드 제목",
    })

    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        example: "YELLOW",
        description: "수정할 보드 색상",
    })

    @IsOptional()
    @IsString()
    color?: Color;

    @ApiProperty({
        example: "이 보드는 OO팀을 위한 칸반 보드입니다.",
        description: "수정할 보드 설명",
    })

    @IsOptional()
    @IsString()
    description?: string;
 }
