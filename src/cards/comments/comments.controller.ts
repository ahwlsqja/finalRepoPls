import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Users } from "src/users/entities/user.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorator/user.decorator";
import { AuthGuard } from "@nestjs/passport";
import { BoardMemberGuard } from "src/auth/guard/boardmember.guard";

@UseGuards(AuthGuard('jwt'))
@ApiTags("Comments")
@Controller(":boardId/:columnId/:cardId/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "카드 내 댓글 등록 API" })
  @Post()
  async createComment(
    @User() user: Users, 
    @Param("boardId") boardId: number,
    @Param("columnId") columnId: number,
    @Param("cardId") cardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const data = await this.commentsService.createComment(
      user.id, 
      boardId,
      columnId,
      cardId,
      createCommentDto.content,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: "댓글 생성에 성공하였습니다.",
      data,
    };
  }
  /**
   * 영우's 카드 상세 조회에 편입시키는게 좋을 것 같음.
   * - /columns에서 Column 조회하면, Card 목록이 나오고,
   * - /cards에서 Card 조회하면, Comments 목록이 나오도록하면,
   * - 각 도메인에서 getAll-, get-ById API 갯수를 줄일 수 있을듯.
   */
  @ApiOperation({ summary: "카드 내 댓글 상세 조회 API " })
  @Get("/:commentId")

  async getCommentByCommentId(
    @Param("commentId") commentId: number
    ) {
    const data = await this.commentsService.getCommentByCommentId(commentId);
    return {
      statusCode: HttpStatus.OK,
      message: "댓글 상세 조회에 성공하였습니다.",
      data,
    };
  }

  @ApiOperation({ summary: "카드 내 댓글 수정 API " })
  @Patch("/:commentId")
  async updateComment(
    @User() user: Users, 
    @Param("commentId") commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const data = await this.commentsService.updateComment(
      user.id,
      commentId,
      updateCommentDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "댓글 수정에 성공하였습니다.",
      data,
    };
  }

  @ApiOperation({ summary: "카드 내 댓글 삭제 API " })
  @Delete("/:commentId")
  async deleteComment(
    @User() user: Users,
    @Param("commentId") commentId: number,
  ) {
    await this.commentsService.deleteComment(user.id, commentId);
    return {
      statusCode: HttpStatus.OK,
      message: "댓글 삭제에 성공하였습니다.",
    };
  }
}
