import { Controller, Get, Post, Body, Param, Patch, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Columns } from './entities/column.entity';
import { BoardMemberGuard } from 'src/auth/guard/boardmember.guard';
import { BoardsService } from 'src/boards/boards.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('/:boardId/columns')

export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly boardsService: BoardsService,
    ) { }

  //칼럼 생성
  @UseGuards(BoardMemberGuard)
  @Post()
  async create(
    @Param('boardId') boardId: number,
    @Body() createColumnDto: CreateColumnDto,
    ) {
        const ColumnCount = await this.columnsService.count(boardId); // 전체 칼럼 갯수
        return await this.columnsService.create(
          boardId,
          createColumnDto,
          ColumnCount + 1, 
        );    
  }

  // 특정 보드 모든 칼럼 조회
  @UseGuards(BoardMemberGuard)
  @Get('all/:boardId')
  async findAll(@Param('boardId') boardId: number) {
    return await this.columnsService.findAll(boardId);
  }

  // 특정 보드 칼럼 한개 조회
  @UseGuards(BoardMemberGuard)
  @Get(':columnId')
  async findOne(@Param('columnId') id: number) {
    return await this.columnsService.findColumns(+id);
  }

  // 컬럼 업데이트
  @UseGuards(BoardMemberGuard)
  @Patch(':columnId')
  async update(
    @Param('columnId') id: number,
    @Body() updateColumnDto: UpdateColumnDto
    )
    {
    return await this.columnsService.update(+id, updateColumnDto);
  }

  // 컬럼 이동
  @UseGuards(BoardMemberGuard)
  @Patch(':columnId/:newOrder')
  async swapColumnOrder(
    @Param('columnId') id: number,
    @Param('newOrder') newOrder: number,
  ){
    await this.columnsService.swapOrder(id, newOrder);
    return {
      message: '칼럼 순서를 변경하였습니다.'
    }
  }

  // 칼럼 삭제
  @UseGuards(BoardMemberGuard)
  @Delete(':columnId')
  async remove(@Param('columnId') id: number){
    return await this.columnsService.remove(+id);
  }
}
