import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Users } from "src/users/entities/user.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorator/user.decorator";

@ApiTags("Comments")
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: "카드 내 댓글 등록 API" })
  @Post("/:cardId")
  async createComment(
    @User() user: Users, // @커스텀데코레이터에서 user 정보 가져오기
    @Param("cardId") cardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const data = await this.commentsService.createComment(
      cardId, // req.params의 cardId
      user.id, // req.user의 id
      createCommentDto.content, //dto의 content
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
  @ApiOperation({ summary: "카드 내 댓글 목록 조회 API " })
  @Get("/:cardId")
  async getCommentByCardId(@Param("cardId") cardId: number) {
    const data = await this.commentsService.getCommentByCardId(cardId);
    return {
      statusCode: HttpStatus.OK,
      message: "댓글 목록 조회에 성공하였습니다.",
      data,
    };
  }

  @ApiOperation({ summary: "카드 내 댓글 수정 API " })
  @Patch("/:commentId")
  async updateComment(
    @User() user: Users, // @커스텀데코레이터에서 user 정보 가져오기
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
    @User() user: Users, // @커스텀데코레이터에서 user 정보 가져오기
    @Param("commentId") commentId: number,
  ) {
    await this.commentsService.deleteComment(user.id, commentId);
    return {
      statusCode: HttpStatus.OK,
      message: "댓글 삭제에 성공하였습니다.",
    };
  }
}
