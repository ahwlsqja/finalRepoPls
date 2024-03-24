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

@ApiTags("CheckLists & CheckCurrent")
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
  @Post()
  async createCheckList(
    @Param("boardId") boardId: number,
    @Param("columnId") columnId: number,
    @Param("cardId") cardId: number,
    @Body() createCheckListDto: CreateCheckListDto
    ) {
    const data = await this.checkListsService.createCheckList(
      boardId,
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

  @ApiOperation({ summary: "카드 내 체크리스트 제목 수정 API " })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: UpdateCheckListDto })
  @Patch("/:checkListId")
  async updateCheckList(
    @Param("checkListId") checkListId: number,
    @Body() updateCheckListDto: UpdateCheckListDto,
  ) {
    const data = await this.checkListsService.updateCheckList(
      checkListId,
      updateCheckListDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "체크리스트 수정에 성공하였습니다.",
      data,
    };
  }

  @ApiOperation({ summary: "카드 내 체크리스트 삭제 API " })
  @ApiBearerAuth("access-token")
  @Delete("/:checkListId")
  async deleteCheckList(
    @Param("checkListId") checkListId: number,
  ) {
    await this.checkListsService.deleteCheckList(checkListId);
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
  @Post('/:checkListId/checkcurrents')
  async createCheckCurrent(    
    @Param("boardId") boardId: number,
    @Param("columnId") columnId: number,
    @Param("cardId") cardId: number,
    @Param("checkListId") checkListId: number,
    @Body() createCheckCurrentDto: CreateCheckCurrentDto
  ) {
  const data = await this.checkListsService.createCheckCurrent(
    boardId,
    columnId,
    cardId,
    checkListId,
    createCheckCurrentDto
  );
  return {
    statusCode: HttpStatus.CREATED,
    message: "할 일 생성에 성공하였습니다.",
    data,
  }
}

  @ApiOperation({ summary: "체크리스트 내 할 일 내용 및 진행상태 수정 API " })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: UpdateCheckCurrentDto })
  @Patch("/:checkListId/checkcurrents/:checkCurrentId")
  async updateCheckCurrent(
    @Param("checkListId") checkListId: number,
    @Param("checkCurrentId") checkCurrentId: number,
    @Body() updateCheckCurrentDto: UpdateCheckCurrentDto,
  ) {
    const data = await this.checkListsService.updateCheckCurrent(
      checkListId,
      checkCurrentId,
      updateCheckCurrentDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "할 일 수정에 성공하였습니다.",
      data,
    };
  }

  @ApiOperation({ summary: "체크리스트 내 할 일 삭제 API " })
  @ApiBearerAuth("access-token")
  @Delete("/:checkListId/checkcurrents/:checkCurrentId")
  async deleteCheckCurrent(
    @Param("checkListId") checkListId: number,
    @Param("checkCurrentId") checkCurrentId: number,
  ) {
    await this.checkListsService.deleteCheckCurrent(checkListId, checkCurrentId);
    return {
      statusCode: HttpStatus.OK,
      message: "할 일 삭제에 성공하였습니다.",
    };
  }

}
