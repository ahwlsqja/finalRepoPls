import { PartialType } from "@nestjs/swagger";
import { CreateBoardDto } from "./create-board.dto";
import { IsOptional, IsString } from "class-validator";
import { Color } from "src/common/types/color.type";

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    color?: Color;

    @IsOptional()
    @IsString()
    description?: string;
 }
