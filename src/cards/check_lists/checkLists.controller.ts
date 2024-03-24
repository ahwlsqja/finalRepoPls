import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from "@nestjs/common"
import { CheckListsService } from "./checkLists.service";
import { UpdateCheckListDto } from "./dto/update-checkList.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateCheckListDto } from "./dto/create-checkList.dto";
import { AuthGuard } from "@nestjs/passport";
import { BoardMemberGuard } from "src/auth/guard/boardmember.guard";
import { CreateCheckCurrentDto } from "./dto/create-checkCurrent.dto";
import { UpdateCheckCurrentDto } from "./dto/update-checkCurrent.dto";
import { Users } from "src/users/entities/user.entity";
import { User } from "src/common/decorator/user.decorator";

@ApiTags("E. CheckLists & CheckCurrent")
@UseGuards(AuthGuard('jwt'))
@Controller("/boards/:boardId/columns/:columnId/cards/:cardId/checkLists")
export class CheckListsController {
  constructor(
    private readonly checkListsService: CheckListsService
    ) {}

  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "카드 내 체크리스트 등록 API" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreateCheckListDto })
  // /boards/:boardId/columns/:columnId/cards/:cardId/checkLists
  @Post()
  async createCheckList(
    @Param("boardId") boardId: number,
    @Param("columnId") columnId: number,
    @Param("cardId") cardId: number,
    @Body() createCheckListDto: CreateCheckListDto,
    @User() user: Users,
    ) {
    const name = user.name
    const data = await this.checkListsService.createCheckList(
      boardId,
      name,
      columnId,
      cardId,
      createCheckListDto
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: "체크리스트 생성에 성공하였습니다.",
      data,
    }
  }

  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "카드 내 체크리스트 제목 수정 API " })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: UpdateCheckListDto })
  // /boards/:boardId/columns/:columnId/cards/:cardId/checkLists/:checkListId
  @Patch("/:checkListId")
  async updateCheckList(
    @Param("checkListId") checkListId: number,
    @User() user: Users,
    @Body() updateCheckListDto: UpdateCheckListDto,
  ) {
    const name = user.name
    const data = await this.checkListsService.updateCheckList(
      checkListId,
      name,
      updateCheckListDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "체크리스트 수정에 성공하였습니다.",
      data,
    };
  }

  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "카드 내 체크리스트 삭제 API " })
  @ApiBearerAuth("access-token")
  @Delete("/:checkListId")
  // /boards/:boardId/columns/:columnId/cards/:cardId/checkLists/:checkListId
  async deleteCheckList(
    @Param("checkListId") checkListId: number,
    @User() user: Users,
  ) {
    const name = user.name
    await this.checkListsService.deleteCheckList(checkListId, name);
    return {
      statusCode: HttpStatus.OK,
      message: "체크리스트 삭제에 성공하였습니다.",
    };
  }

  // ===============================================
  //            CheckCurrent 관련 API
  // ===============================================

  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "체크리스트 내 할일 등록 API" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreateCheckCurrentDto })
  // /boards/:boardId/columns/:columnId/cards/:cardId/checkLists/:checkListId/checkcurrents
  @Post('/:checkListId/checkcurrents')
  async createCheckCurrent(    
    @Param("boardId") boardId: number,
    @Param("columnId") columnId: number,
    @Param("cardId") cardId: number,
    @Param("checkListId") checkListId: number,
    @User() user:Users,
    @Body() createCheckCurrentDto: CreateCheckCurrentDto
  ) {
    const name = user.name
  const data = await this.checkListsService.createCheckCurrent(
    boardId,
    columnId,
    cardId,
    name,
    checkListId,
    createCheckCurrentDto
  );
  return {
    statusCode: HttpStatus.CREATED,
    message: "할 일 생성에 성공하였습니다.",
    data,
  }
}

  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "체크리스트 내 할 일 내용 및 진행상태 수정 API " })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: UpdateCheckCurrentDto })
  @Patch("/:checkListId/checkcurrents/:checkCurrentId")
  // /boards/:boardId/columns/:columnId/cards/:cardId/checkLists/:checkListId/:checkCurrentId
  async updateCheckCurrent(
    @Param("checkListId") checkListId: number,
    @Param("checkCurrentId") checkCurrentId: number,
    @User() user:Users,
    @Body() updateCheckCurrentDto: UpdateCheckCurrentDto,
  ) {
    const name = user.name
    const data = await this.checkListsService.updateCheckCurrent(
      checkListId,
      checkCurrentId,
      name,
      updateCheckCurrentDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "할 일 수정에 성공하였습니다.",
      data,
    };
  }

  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "체크리스트 내 할 일 삭제 API " })
  @ApiBearerAuth("access-token")
  @Delete("/:checkListId/checkcurrents/:checkCurrentId")
  // /boards/:boardId/columns/:columnId/cards/:cardId/checkLists/:checkListId/:checkCurrentId
  async deleteCheckCurrent(
    @Param("checkListId") checkListId: number,
    @Param("checkCurrentId") checkCurrentId: number,
    @User() user:Users,
  ) {
    const name = user.name

    await this.checkListsService.deleteCheckCurrent(checkListId, checkCurrentId, name);
    return {
      statusCode: HttpStatus.OK,
      message: "할 일 삭제에 성공하였습니다.",
    };
  }

}
