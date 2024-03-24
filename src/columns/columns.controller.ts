import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { BoardMemberGuard } from 'src/auth/guard/boardmember.guard';
import { BoardsService } from 'src/boards/boards.service';
import { AuthGuard } from '@nestjs/passport';
import { Users } from 'src/users/entities/user.entity';
import { User } from 'src/common/decorator/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("B. Columns")
@UseGuards(AuthGuard('jwt'))
@Controller('/boards/:boardId/columns')

export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly boardsService: BoardsService,
    ) { }

  // 컬럼 생성 API
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "보드 내 컬럼 등록 API" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreateColumnDto })
  @Post()
  async create(
    @Param('boardId') boardId: number,
    @User() user: Users,
    @Body() createColumnDto: CreateColumnDto,
  ) {
    const name = user.name
    const ColumnCount = await this.columnsService.count(boardId);
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

  // 특정 보드 모든 칼럼 조회 API
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "특정 보드 모든 칼럼 조회 API " })
  @ApiBearerAuth("access-token")
  @Get('all')
  async getAllColumnByBoardId(@Param('boardId') boardId: number) {
    const data = await this.columnsService.getAllColumnByBoardId(boardId);
    return {
      statusCode: HttpStatus.OK,
      messgae: '컬럼 조회에 성공하였습니다.',
      data
    }
  }

  // 특정 보드 컬럼 상세 조회 API
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "특정 보드 컬럼 상세 조회 API " })
  @ApiBearerAuth("access-token")
  @Get(':columnId')
  async getColumnByColumnId(
    @Param('columnId') id: number
    ) {
    const data = await this.columnsService.getColumnByColumnId(+id);
    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 상세 조회에 성공하였습니다.',
      data
    }
  }

  // 컬럼 수정 API
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "카드 내 댓글 수정 API " })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: UpdateColumnDto })
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

  // 컬럼 삭제 API
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "보드 내 컬럼 삭제 API " })
  @ApiBearerAuth("access-token")
  @Delete(':columnId')
  async remove(
    @Param('columnId') id: number,
    @User() user: Users,
    ){
    const name = user.name
    await this.columnsService.remove(+id, name);
    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 삭제에 성공하였습니다.',
    }
  }

  // 컬럼 순서 변경 및 위치 이동 API
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "컬럼 순서 변경 및 위치 이동 API" })
  @ApiBearerAuth("access-token")
  @Patch(':columnId/swapOrder/:newOrder')
  async swapColumnOrder(
    @Param('columnId') id: number,
    @User() user:Users,
    @Param('newOrder') newOrder: number,
  ){
    const name = user.name
    await this.columnsService.swapOrder(id, name, newOrder);
    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 순서를 변경하였습니다.',
    }
  }

}
