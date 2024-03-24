import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "./entities/comment.entity";
import { DataSource, Repository } from "typeorm";
import _ from "lodash";
import { Cards } from "../entities/card.entity";
import { SlackService } from "../../common/slackMessage.service";
import { NotificationsService } from "src/notification/notifications.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>,
    private readonly notificationsService: NotificationsService,
    private dataSource: DataSource,
  ) {}

  // 댓글 생성
  async createComment(
    userId: number, 
    boardId: number,
    columnId: number,
    cardId: number, 
    name: string,
    content: string
    ) {

      // 1. 저장 하는 카드가 있는지 검사
      const card = await this.cardsRepository.findOne({
        where: {
            id: cardId
        }
      });
      if (!card) {
          throw new InternalServerErrorException("해당 카드를 찾을 수 없습니다.");
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction('READ COMMITTED'); 

      try{

      // 2. 댓글 생성
      const comment = queryRunner.manager.create(Comments,{
        userId,
        cardId,
        content,
      });

      // 3. 댓글 저장
      await this.commentsRepository.save(comment);

      await this.notificationsService.sendNotification({
        name,
        type: '댓글 생성',
        message: `댓글을 등록하였습니다: ${comment.content}.`,
      })

      await queryRunner.commitTransaction(); // 트랜잭션 종료

      return { status: 201, message: '댓글 생성 성공', comment};

    } catch(error) {
      await queryRunner.rollbackTransaction();
      return { status: 500, message: '댓글 생성 실패'};
    } finally {
      await queryRunner.release(); 
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


  // 댓글 수정 
  async updateComment(
    userId: number,
    name: string,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const { content } = updateCommentDto
    // 1. 해당 유저가 쓴 댓글이 맞는지 검사
    await this.verifyComment(userId, commentId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    // 트랜잭션 시작
    try{
    // 2. 해당 유저가 쓴 댓글이 업데이트

      const updatedComment = await queryRunner.manager.save(Comments,{
        id: commentId,
        content,
    });

    // 3. 푸쉬 알림 보내기
      await this.notificationsService.sendNotification({
      name,
      type: '댓글 수정',
      message: `댓글을 수정하였습니다: ${content}.`,
    })
      await queryRunner.commitTransaction(); // 트랜잭션 종료

      return { status: 201, message: '댓글 수정 성공', updatedComment};


  }catch(error) {
      await queryRunner.rollbackTransaction();
      return { status: 500, message: '댓글 수정 실패'};

    } finally {
      await queryRunner.release(); 

    }
}

  // 댓글 삭제
  async deleteComment(userId: number, name: string, commentId: number) {
    try {
      await this.verifyComment(userId, commentId);
      await this.notificationsService.sendNotification({
        name,
        type: '댓글 삭제',
        message: `댓글을 삭제하였습니다.`,
      })
      await this.commentsRepository.delete({ id: commentId });

      return { status: 201, message: '댓글 삭제 성공'};

      
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
