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
import { ApiOperation } from "@nestjs/swagger";
import { CreateCheckListDto } from "./dto/create-checkList.dto copy";
import { AuthGuard } from "@nestjs/passport";
import { BoardMemberGuard } from "src/auth/guard/boardmember.guard";

@UseGuards(AuthGuard('jwt'))
@Controller(":boardId/:columnId/:cardId/checkLists")
export class CheckListsController {
  constructor(
    private readonly checkListsService: CheckListsService
    ) {}

  @ApiOperation({ summary: "카드 내 체크리스트 등록 API" })
  @UseGuards(BoardMemberGuard)
  @Post()
  async createChecklist(
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

}
