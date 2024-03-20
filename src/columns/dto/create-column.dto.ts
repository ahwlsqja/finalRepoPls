// src/columns/dto/create-column.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Color } from '../../common/types/color.type';

export class CreateColumnDto {

    @IsNotEmpty()
    @IsNumber()
    boardId: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsEnum(Color)
    color: Color;

    @IsNumber()
    @IsOptional()
    orderByColumns?: number;

}
