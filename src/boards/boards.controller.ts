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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorator/user.decorator";
import { Users } from "src/users/entities/user.entity";
import { InvitationDto } from "./dto/invite.dto";
import { AuthenticateDto } from "./dto/authenticateEmailDto";
import { BoardMemberGuard } from "../auth/guard/boardmember.guard";
import { BoardHostGuard } from "../auth/guard/boardhost.guard";
import { Board } from "./entities/board.entity";
import { AuthGuard } from "@nestjs/passport";
import { UpdateBoardDto } from "./dto/board.update.dto";

@ApiTags("A2. Boards")
@UseGuards(AuthGuard('jwt'))
@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}
  
  // 보드 생성 API
  @ApiOperation({ summary: '보드 생성 API' })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreateBoardDto })
  @ApiResponse({ type: Board })
  @Post()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @User() user: Users,
    ) {
    const data = this.boardsService.createBoard(user.id, user.name, createBoardDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: "보드 생성에 성공하였습니다.",
      data
    }
  }



  // 특정 보드 조회 API
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: '특정 보드 조회 API' })
  @ApiBearerAuth("access-token")
  @ApiResponse({ type: Board })
  @Get(':id')
  async getBoardByBoardId(
    @Param('id') id: number)
  {
    const data = await this.boardsService.getBoardByBoardId(id)
    return {
      statusCode: HttpStatus.OK,
      message: "보드 상세 조회에 성공하였습니다.",
      data
    }
  }

  // 로그인한 id 기반으로 특정 보드 조회
  @ApiOperation({ summary: '자신의 보드 조회 API' })
  @ApiBearerAuth("access-token")
  @ApiResponse({ type: Board })
  @Get()
  async getAllBoardById(
    @User() user: Users,
  ) {
    const data = this.boardsService.getAllBoardById(user.id, user.name)
    return {
      statusCode: HttpStatus.OK,
      message: "특정 보드 조회에 성공하였습니다.",
      data
    }
  }



  // 보드 수정(호스트) API
  @UseGuards(BoardHostGuard)
  @ApiOperation({ summary: "보드 수정(호스트) API" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: UpdateBoardDto })
  @Patch(":id")
  async updateBoard(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @User() user: Users,
  ){
    const name = user.name
    const data = await this.boardsService.updateBoard(user.id, name, +id, updateBoardDto);
    return {
      statusCode: HttpStatus.OK,
      message: "보드 수정(호스트)에 성공하였습니다.",
      data
    }
  }



  // 보드 삭제(호스트) API
  @UseGuards(BoardHostGuard)
  @ApiOperation({ summary: "보드 삭제(호스트) API" })
  @ApiBearerAuth("access-token")
  @Delete(":id")
  async removeMyBoard(
    @Param('id') id: number,
    @User() user: Users) {
    const userId = user.id
    const name = user.name
    await this.boardsService.removeMyBoard(userId,name, +id);
    return {
      statusCode: HttpStatus.OK,
      message: "보드 삭제(호스트)에 성공하였습니다.",
    }
  }


  
  // 맴버 초대(호스트) API
  @UseGuards(BoardHostGuard)
  @ApiOperation({ summary: "맴버 초대(호스트) API" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: InvitationDto })
  @Post('haveover/:boardId')
  async inviteMember(
    @Param('boardId') boardId: number,
    @Body() invitationDto: InvitationDto,
    @User() user: Users
  ){
    return this.boardsService.invite(boardId, invitationDto, user)
  }



  // 유저 초대 수락(인증번호 인증) API
  @ApiOperation({ summary: "유저 초대 수락(인증번호 인증) API" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: AuthenticateDto })
  @Post('accept')
  async authenticateEmail(
    @Body() authenticateDto: AuthenticateDto
    )
    {
      const hostUser = await this.boardsService.authenticateEmail(
        authenticateDto.memberEmail,
        +authenticateDto.authenticateEmailCode,
      );

      return { 
        statusCode: HttpStatus.OK,
        message: `인증 및 초대 처리가 완료되었습니다. 반갑습니다. ${authenticateDto.memberEmail}님`, 
        data: hostUser}

    }

  // 보드 삭제 복구 API
  @UseGuards(BoardHostGuard)
  @ApiOperation({ summary: "보드 삭제 복구 API" })
  @ApiBearerAuth("access-token")
  @Patch('restore/:id')
  async restoreBoard(
    @Param('id') id: number,
    @User() user: Users
  ) {
    const name = user.name
    const data = await this.boardsService.restoreMyBoard(user.id, id, name)
    return {
      statusCode: HttpStatus.OK,
      message: "삭제한 보드를 성공적으로 복구하였습니다.",
    }
  }
}
