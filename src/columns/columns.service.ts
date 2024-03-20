// columns.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Columns } from './entities/column.entity';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Columns)
    private columnsRepository: Repository<Columns>,
  ) { }

  async create(createColumnDto: CreateColumnDto, boardId: number): Promise<Columns> {
    const { title, color } = createColumnDto;
    const newColumn = this.columnsRepository.create({
      boardId,
      title,
      color,
    });

    // 기존 컬럼들의 orderByColumns 중 누락된 값을 찾습니다.
    const existingColumns = await this.columnsRepository.find({ where: { boardId } });
    const existingOrderByColumns = existingColumns.map(column => column.orderByColumns).sort((a, b) => a - b);
    let missingOrderByColumn = 1;
    for (const orderByColumn of existingOrderByColumns) {
      if (orderByColumn !== missingOrderByColumn) {
        break;
      }
      missingOrderByColumn++;
    }

    // 새로운 컬럼에 누락된 orderByColumns 값을 할당합니다.
    newColumn.orderByColumns = missingOrderByColumn;

    await this.columnsRepository.save(newColumn);
    return newColumn;
  }

  async findAll(): Promise<Columns[]> {
    return this.columnsRepository.find();
  }

  async findColumns(id: number): Promise<Columns> {
    const column = await this.columnsRepository.findOne({
      where: { id }
    });
    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<Columns> {
    const column = await this.findColumns(id);
    const updatedAt = new Date();
    const updatedColumn = {
      ...column,
      ...updateColumnDto,
      updatedAt,
    };
    return this.columnsRepository.save(updatedColumn);
  }

  async remove(id: number): Promise<void> {
    const column = await this.findColumns(id);
    await this.columnsRepository.remove(column);
  }

  async changeOrder(id: number, newOrder: number): Promise<void> {
    const column = await this.findColumns(id);
    const existingColumns = await this.columnsRepository.find({ where: { boardId: column.boardId } });

    // Remove the column from the existing columns array
    const remainingColumns = existingColumns.filter(c => c.id !== id);

    // Update the order for the moved column
    column.orderByColumns = newOrder;

    // Sort the remaining columns by order
    const sortedColumns = remainingColumns.sort((a, b) => a.orderByColumns - b.orderByColumns);

    // Assign new order values to the remaining columns
    let order = 1;
    for (const col of sortedColumns) {
      col.orderByColumns = order++;
    }

    // Save the updated columns
    await this.columnsRepository.save([column, ...sortedColumns]);
  }

}