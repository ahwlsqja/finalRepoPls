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
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'))
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':cardId')
  async createComment(
    @UserInfo() user: Users, // @커스텀데코레이터에서 user 정보 가져오기
    @Body() createCommentDto: CreateCommentDto) {
    const data = await this.commentsService.createComment(
      cardId, // cardId
      user.id, // user의 id
      createCommentDto.content, //dto의 content
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: '댓글 생성에 성공하였습니다.',
      data
    }
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.commentsService.remove(+id);
  }
}
