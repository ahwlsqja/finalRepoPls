import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "./entities/comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>
  )
  async createComment(cardId: number, userId: number, content: string) {
    try {
      const comment = await this.commentsService.create({
        cardId, // cardId
        user.id, // user의 id
        createCommentDto.content, //dto의 content
    });
      await this.commentsRepository.save(comment)
      return comment;
    } catch (error) {
      throw new InternalServerErrorException(
        "댓글 등록 중 오류가 발생했습니다.",
      )
    }
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
