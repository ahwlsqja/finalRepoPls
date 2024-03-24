// src/columns/dto/update-column.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';
import { IsOptional, IsString } from 'class-validator';
import { Color } from 'src/common/types/color.type';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {

    @ApiProperty({
      example: "InProgress",
      description: "수정할 컬럼 제목",
    })

    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
      example: "GREEN",
      description: "수정할 컬럼 색상",
    })

    @IsOptional()
    @IsString()
    color?: Color;
 }
