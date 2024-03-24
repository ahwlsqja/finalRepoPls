import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "./entities/comment.entity";
import { Repository } from "typeorm";
import _ from "lodash";
import { Cards } from "../entities/card.entity";


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>
  ) {}

  async createComment(
    userId: number, 
    boardId: number,
    columnId: number,
    cardId: number, 
    content: string
    ) {

    try {
      const card = await this.cardsRepository.findOne({
        where: {
            id: cardId
        }
      });
      if (!card) {
          throw new InternalServerErrorException("해당 카드를 찾을 수 없습니다.");
      }
      console.log(card.id)
      console.log(card)
      const comment = this.commentsRepository.create({
        userId,
        cardId,
        content,
      });
      await this.commentsRepository.save(comment);

      return comment;
    } catch (error) {
      throw new InternalServerErrorException(
        "댓글 등록 중 오류가 발생했습니다.",
      );
    }
  }

  async getCommentByCommentId(commentId: number) {
    const comment = await this.cardsRepository.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException(`존재하지 않는 댓글 ${commentId} 입니다.`);
    }

    return comment;
  }

  async updateComment(
    userId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    try {
      const { content } = updateCommentDto
      await this.verifyComment(userId, commentId);
      const updatedComment = await this.commentsRepository.save({
        id: commentId,
        content,
    });
      return updatedComment
    } catch (error) {
      throw new InternalServerErrorException(
        "댓글 수정 중 오류가 발생했습니다.",
      );
    }
  }

  async deleteComment(userId: number, commentId: number) {
    try {
      await this.verifyComment(userId, commentId);
      return await this.commentsRepository.delete({ id: commentId });
    } catch (error) {
      throw new InternalServerErrorException(
        "댓글 삭제 중 오류가 발생했습니다.",
      );
    }
  }

  async verifyComment(userId: number, commentId: number) {
    const comment = await this.commentsRepository.findOneBy({
      id: commentId,
    });
    if (_.isNil(comment) || comment.userId !== userId) {
      throw new NotFoundException(
        "댓글을 찾을 수 없거나, 수정/삭제할 권한이 없습니다.",
      );
    }
  }
}
