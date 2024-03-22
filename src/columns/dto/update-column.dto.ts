// src/columns/dto/update-column.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';
import { IsOptional, IsString } from 'class-validator';
import { Color } from 'src/common/types/color.type';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    color?: Color;
 }
