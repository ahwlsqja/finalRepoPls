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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorator/user.decorator";
import { AuthGuard } from "@nestjs/passport";
import { BoardMemberGuard } from "src/auth/guard/boardmember.guard";

@ApiTags("Comments")
@UseGuards(AuthGuard('jwt'))
@Controller("/boards/:boardId/columns/:columnId/cards/:cardId/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "카드 내 댓글 등록 API" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreateCommentDto })
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

  @ApiOperation({ summary: "카드 내 댓글 상세 조회 API " })
  @ApiBearerAuth("access-token")
  @Get("/:commentId")

  async getCommentByCommentId(
    @Param("commentId") commentId: number
    ) {
    const data = await this.commentsService.getCommentByCommentId(commentId);
    return {
      statusCode: HttpStatus.OK,
      message: "댓글 상세 조회에 성공하였습니다.",
      data
    };
  }

  @ApiOperation({ summary: "카드 내 댓글 수정 API " })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: UpdateCommentDto })
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
  @ApiBearerAuth("access-token")
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
