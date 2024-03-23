import { PartialType } from "@nestjs/mapped-types";
import { CreateCardDto } from "./create-card.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Color } from "src/common/types/color.type";

export class UpdateCardDto extends PartialType(CreateCardDto) {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    color?: Color;

    @IsString()
    @IsOptional()
    content?: string;

    @IsOptional()
    endDate?: Date;
}
