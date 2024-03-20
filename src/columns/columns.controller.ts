// columns.controller.ts

import { Controller, Get, Post, Body, Param, Patch, Delete, BadRequestException } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Columns } from './entities/column.entity';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }

  @Post()
  async create(@Body() createColumnDto: CreateColumnDto) {
    const { boardId, title, color } = createColumnDto;

    if (!boardId) {
      throw new BadRequestException('보드 ID가 필요합니다.');
    }

    const data = await this.columnsService.create(createColumnDto, boardId);

    return {
      message: '컬럼 생성을 성공했습니다.',
      data,
    };
  }

  @Get()
  findAll(): Promise<Columns[]> {
    return this.columnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Columns> {
    return this.columnsService.findColumns(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto): Promise<Columns> {
    return this.columnsService.update(+id, updateColumnDto);
  }

  @Patch('order/:id')
  changeOrder(@Param('id') id: string, @Body('orderByColumns') newOrder: number): Promise<void> {
    return this.columnsService.changeOrder(+id, newOrder);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.columnsService.remove(+id);
  }
}
