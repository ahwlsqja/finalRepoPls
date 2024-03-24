import { Controller, Get, Post, Body, Param, Patch, Delete, BadRequestException, UseGuards, HttpStatus } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { BoardMemberGuard } from 'src/auth/guard/boardmember.guard';
import { BoardsService } from 'src/boards/boards.service';
import { AuthGuard } from '@nestjs/passport';
import { Users } from 'src/users/entities/user.entity';
import { User } from 'src/common/decorator/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('/:boardId/columns')

export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly boardsService: BoardsService,
    ) { }

  //칼럼 생성
  //response 변경 및 서비스에서 card -> cards 변경
  @UseGuards(BoardMemberGuard)
  @Post()
  async create(
    @Param('boardId') boardId: number,
    @User() user: Users,
    @Body() createColumnDto: CreateColumnDto,
    ) {
        const name = user.name
        const ColumnCount = await this.columnsService.count(boardId); // 전체 칼럼 갯수
        const data = await this.columnsService.create(
          boardId,
          name,
          createColumnDto,
          ColumnCount + 1, 
        );    
        return {
          statusCode: HttpStatus.CREATED,
          messgae: '컬럼 생성에 성공하였습니다.',
          ColumnCount,
          data
        }
  }

  // 특정 보드 모든 칼럼 조회
  // response 변경
  @UseGuards(BoardMemberGuard)
  @Get('all/:boardId')
  async findAll(@Param('boardId') boardId: number) {
    const data = await this.columnsService.findAll(boardId);
    return {
      statusCode: HttpStatus.OK,
      messgae: '컬럼 조회에 성공하였습니다.',
      data
    }
  }

  // 특정 보드 칼럼 한개 조회
  // response 변경
  @UseGuards(BoardMemberGuard)
  @Get(':columnId')
  async findOne(@Param('columnId') id: number) { //getColumnByColumnId
    const data = await this.columnsService.findColumns(+id);
    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 상세 조회에 성공하였습니다.',
      data
    }
  }

  // 컬럼 업데이트
  // response 변경
  @UseGuards(BoardMemberGuard)
  @Patch(':columnId')
  async update(
    @Param('columnId') id: number,
    @User() user: Users,
    @Body() updateColumnDto: UpdateColumnDto
    )
    {
    const name = user.name
    const data = await this.columnsService.update(+id, name, updateColumnDto);
    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 수정에 성공하였습니다.',
      data
    }
  }

  // 컬럼 이동
  @UseGuards(BoardMemberGuard)
  @Patch(':columnId/:newOrder')
  async swapColumnOrder(
    @Param('columnId') id: number,
    @User() user:Users,
    @Param('newOrder') newOrder: number,
  ){
    const name = user.name
    await this.columnsService.swapOrder(id,name, newOrder);
    return {
      statusCode: HttpStatus.OK,
      message: '칼럼 순서를 변경하였습니다.',
    }
  }

  // 칼럼 삭제
  @UseGuards(BoardMemberGuard)
  @Delete(':columnId')
  async remove(
    @Param('columnId') id: number,
    @User() user: Users,
    ){
    const name = user.name
    await this.columnsService.remove(+id, name);
    return {
      statusCode: HttpStatus.OK,
      message: '칼럼 삭제에 성공하였습니다.',
    }
  }
}
