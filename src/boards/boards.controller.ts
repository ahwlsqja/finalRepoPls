import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from "@nestjs/common"
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { User } from "src/common/decorator/user.decorator";
import { Users } from "src/users/entities/user.entity";
import { InvitationDto } from "./dto/invite.dto";
import { AuthenticateDto } from "./dto/authenticateEmailDto";
import { BoardMemberGuard } from "../auth/guard/boardmember.guard";
import { BoardHostGuard } from "../auth/guard/boardhost.guard";
import { Board } from "./entities/board.entity";
import { AuthGuard } from "@nestjs/passport";
import { UpdateBoardDto } from "./dto/board.update.dto";

@UseGuards(AuthGuard('jwt'))
@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}
  
  @ApiOperation({
    summary: '보드 만들기 API',
    description: '보드를 만듭니다.',
  })
  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateBoardDto })
  @ApiResponse({ type: Board })
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @User() user: Users,
    ) {
    return this.boardsService.createBoard(user.id, user.name, createBoardDto);
  }



  // 내 보드 조회
  @ApiOperation({
    summary: '특정 보드 조회 API',
    description: '보드를 조회합니다.',
  })
  @ApiBearerAuth()
  @UseGuards(BoardMemberGuard)
  @Get(':id')
  @ApiResponse({ type: Board })
  async getBoardByBoardId(
    @Param('id') id: number)
  {
    const data = this.boardsService.getBoardByBoardId(id)
    return {
      statusCode: HttpStatus.OK,
      message: "보드 상세 조회에 성공하였습니다.",
      data
    }
  }
 


  // 로그인한 id 기반으로 특정 보드 조회
  @ApiOperation({
    summary: '자신의 보드 조회 API',
    description: '보드를 조회합니다.',
  })
  @ApiBearerAuth()
  @Get()
  @ApiResponse({ type: Board })
  async getAllBoardById(
    @User() user: Users,
  ) {
    return this.boardsService.getAllBoardById(user.id, user.name)
  }



  // 보드 수정(호스트)
  @UseGuards(BoardHostGuard)
  @Patch(":id") // boardId 받는거임
  async updateBoard(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @User() user: Users,
  ){
    const name = user.name
    console.log(name)
    return await this.boardsService.updateBoard(user.id, name, +id, updateBoardDto);
  }



  // 보드 삭제(호스트)
  @UseGuards(BoardHostGuard)
  @Delete(":id") // boardId 받는거임
  async removeMyBoard(
    @Param('id') id: number,
    @User() user: Users) {
    const userId = user.id
    const name = user.name
    return this.boardsService.removeMyBoard(userId,name, +id);
  }


  
  // 맴버 초대(호스트)
  @UseGuards(BoardHostGuard)
  @Post('haveover/:boardId')
  async inviteMember(
    @Param('boardId') boardId: number,
    @Body() invitationDto: InvitationDto,
    @User() user: Users
  ){
    return this.boardsService.invite(boardId, invitationDto, user)
  }



  // 유저 초대 수락(인증번호 인증)
  @Post('accept')
  async authenticateEmail(
    @Body() authenticateDto: AuthenticateDto
    )
    {
      const hostUser = await this.boardsService.authenticateEmail(
        authenticateDto.memberEmail,
        +authenticateDto.authenticateEmailCode,
      );

      return { message: `인증 및 초대 처리가 완료되었습니다. 반갑습니다. ${authenticateDto.memberEmail}님`, data: hostUser}

    }

  // 보드 삭제 복구
  @UseGuards(BoardHostGuard)
  @Patch('restore/:id')
  async restoreBoard(
    @Param('id') id: number,
    @User() user: Users
  ) {
    const name = user.name
    return await this.boardsService.restoreMyBoard(user.id, id, name)
  }
}
