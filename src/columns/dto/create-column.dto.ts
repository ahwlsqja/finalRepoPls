// src/columns/dto/create-column.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Color } from '../../common/types/color.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {

    @ApiProperty({
      example: "BackLog",
      description: "컬럼 제목",
    })

    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
      example: "BLACK",
      description: "컬럼 색상",
    })

    @IsNotEmpty()
    @IsEnum(Color)
    color: Color;
}
