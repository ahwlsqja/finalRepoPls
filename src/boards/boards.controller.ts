import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common"
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { User } from "src/common/decorator/user.decorator";
import { Users } from "src/users/entities/user.entity";
import { BoardsMemberService } from "./board.member.service";
import { InvitationDto } from "./dto/invite.dto";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService,
              private readonly boardsMemberService: BoardsMemberService) {}
  
  // 보드 생성(/boards)
  @ApiOperation({ summary: '유저 확인'})
  @ApiResponse({
    status: 401,
    description: '권한이 없습니다.'
  })
  @Post()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @User() user: Users,
    ) {
    return this.boardsService.createBoard(user.id, createBoardDto);
  }

  // 특정 보드 조회
  @Get()
  async getBoardByBoardId(
    @Param('id') id: number)
  {
    return this.boardsService.getBoardByBoardId(id)
  }
 
  // 로그인한 id 기반으로 특정 보드 조회
  @Get()
  async getAllBoardById(
    @User() user: Users,
  ) {
    return this.boardsService.getAllBoardById(user.id)
  }

  // 보드 수정(호스트)
  @Patch(":id")
  async updateBoard(
    @Param('id') id: number,
    @Body() updateBoardDto: CreateBoardDto,
    @User() user: Users,
  ){
    return await this.boardsService.updateBoard(user.id, +id, updateBoardDto);
  }

  // 보드 삭제(호스트)
  @Delete(":id")
  async removeMyBoard(
    @Param('id') id: number,
    @User() user: Users) {
    const userId = user.id
    return this.boardsService.removeMyBoard(userId, +id);
  }

  // // 맴버 초대(호스트)
  // @Post()
  // async inviteMember(
  //   @Param('boardId') boardId: number,
  //   @Body() invitationDto: InvitationDto,
  //   @User() user: Users
  // ){
  //   return this.boardsService.invite(boardId, user.id, invitationDto, user)
  // }
}
