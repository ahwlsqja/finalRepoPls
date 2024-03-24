
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cards } from "./entities/card.entity";
import { DataSource, Repository } from "typeorm";
import _ from "lodash";
import { CreateCardDto } from "./dto/create-card.dto";
import { CardWorkers } from "./entities/cardworker.entity";
import { NotificationsService } from "src/notification/notifications.service";
import { BoardsService } from "src/boards/boards.service";
import { UpdateCardDto } from "./dto/update-card.dto";

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>,
    private readonly notificationsService: NotificationsService,
    private readonly boardsService: BoardsService,
    private dataSource: DataSource,
  ) {}

  // 카드 상세 조회 API
  async getCardsByColumnId(columnId: number) {
    return await this.cardsRepository.findOne({
        where:{id: columnId,}
  });
  }

  // 카드 생성 API
  async createCard(
    boardId: number, 
    columnId: number, 
    userId: number, 
    name: string,
    createCardDto: CreateCardDto
    ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    
    try{
      // 1. 해당 칼럼의 마지막 orderByCards 값을 가져옴
      const lastCard = await queryRunner.manager.findOne(Cards,{
        where: { columnId },
        order: { orderByCards: 'DESC' }, // 내림차순으로 정렬하여 가장 큰 값을 가져옴
      });

      // 2. 카드를 생성하려는 유저가 이 보드의 멤버인지 검사
      const boardmembers = await this.boardsService.getBoardMember(userId, boardId)

      // 3. 새로운 카드 생성 시 마지막 orderByCards 값에 1을 더함
      const orderByCards = lastCard ? lastCard.orderByCards += 1 : 1

      const { title, color, content, tag, endDate } = createCardDto;

      // 4. 카드 생성
      const card = queryRunner.manager.create(Cards, {
        columnId,
        title,
        color,
        content,
        tag,
        endDate,
        orderByCards,
      });

      // 5. 카드 저장
      await queryRunner.manager.save(Cards, card);

      // 6. 카드 담당자 지정
      const cardWorker = queryRunner.manager.create(CardWorkers,{
        cards: card,
        boardmemberId: boardmembers.id,
      });

      // 7. 카드 담장자 저장
      await queryRunner.manager.save(cardWorker);

      await this.notificationsService.sendNotification({
        name,
        type: '카드 생성',
        message: `카드가 생성되었습니다: ${card.title}.`,
      })

      await queryRunner.commitTransaction(); // 트랜잭션 종료
      
      return card;

    } catch(error) {
      await queryRunner.rollbackTransaction();
      console.log("카드 생성 에러:", error)
      throw new InternalServerErrorException(
        "카드 생성 중 오류가 발생했습니다.",
      );
    } finally {
      await queryRunner.release(); 
    }
  }

   // 카드 수정 API  
  async updateCard(id: number, name: string, updateCardDto: UpdateCardDto) {

    await this.cardsRepository.update({ id }, updateCardDto);

    await this.notificationsService.sendNotification({
      name,
      type: '카드 수정',
      message: `카드가 수정되었습니다: ${updateCardDto.title}.`,
    })

    return {
      title: updateCardDto.title,
      color: updateCardDto.color,  
      content: updateCardDto.content,  
      tag: updateCardDto.tag,  
      endDate: updateCardDto.endDate,  
    };
  }

  // 카드 삭제 API
  async deleteCard(id: number, name: string){
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); 

    try{

      // 1. 삭제하려는 카드가 존재하는지 확인
      const cardToRemove = await queryRunner.manager.findOneBy(Cards, { id })

      if(!cardToRemove) {
        throw new Error('찾으려는 카드이 없습니다,')
      }


      const orderByToRemove = cardToRemove.orderByCards;

      // 2. 카드 삭제
      await queryRunner.manager.remove(Cards, cardToRemove);

      // 3. 삭제된 orderByCards보다 큰 모든 카드 찾기
      const cardToUpdate = await queryRunner.manager
        .createQueryBuilder(Cards, 'cards')
        .where(`cards.orderByCards > :orderByToRemove`, { orderByToRemove })
        .orderBy('cards.orderByCards', 'ASC')
        .getMany();


      for(const card of cardToUpdate) {
        card.orderByCards -= 1;
        await queryRunner.manager.save(Cards, card)
      }
      
      // 푸시 알림 보내기
      await this.notificationsService.sendNotification({
        name,
        type: '카드 삭제',
        message: `${cardToRemove.title} 카드가 성공적으로 삭제되었습니다.`,
      })

      await queryRunner.commitTransaction(); // 트랜잭션 종료

    } catch(error) {
      await queryRunner.rollbackTransaction();
      console.log("카드 삭제 에러:", error)
      throw new InternalServerErrorException(
        "카드 삭제 중 오류가 발생했습니다.",
      );

    } finally {
      await queryRunner.release(); 
    }
  }

  // 담당자 지정 API
  async assignWorker (id: number, boardId: number, name: string, userId: number){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); 

    try{
    // 1. 할당하려는 카드가 존재하는지 확인
    const task = await queryRunner.manager.findOneBy(Cards,{id});
 
    if(!task) {
        throw new NotFoundException('카드가 존재하지 않습니다.')
    }


    // 2. 초대할려는 유저의 존재성 검사
    const isBoardMember = await this.boardsService.getBoardMember(userId, boardId)
    if(!isBoardMember)
    {
      throw new Error("할당하려는 유저가 없습니다.")
    }


    // 3. 이미 카드 작업자에 속해있는지 확인
    const alrealyworker = await queryRunner.manager.findOne(CardWorkers,{
      where: {
        cards: { id },
        boardmember: { id: isBoardMember.id}
      }
    })
 

    if(alrealyworker) {
      throw new Error("이미 유저가 등록되었습니다.")
    }

    // 4. 작업자 배정할 카드 찾기
    const card = await queryRunner.manager.findOne(Cards,{
      where: {
        id: id,
      }
    })

    // 5. 카드 담당자 지정
     const cardWorker = queryRunner.manager.create(CardWorkers,{
      cards: card,
      boardmemberId: isBoardMember.id,
    });

    await this.notificationsService.sendNotification({
      name,
      type: '카드 작업자 등록',
      message: `카드작업자가 등록 되었습니다: ${name}`,
    })

    return await this.cardsRepository.save(cardWorker);

  }

  // 담당자 지정 해제
  async cancelAssignWorker (id: number, boardId: number, name: string, userId: number){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); 

    try{
    // 1. 작업자를 헤재하려는 카드가 존재하는지 확인
    const task = await queryRunner.manager.findOneBy(Cards, {id});

    if(!task) {
        throw new NotFoundException('카드가 존재하지 않습니다.')
    }

    // 2. 삭제하려는 유저의 존재성 검사
    const isBoardMember = await this.boardsService.getBoardMember(userId, boardId)
    if(!isBoardMember) {
      throw new Error("할당하려는 유저가 없습니다.")
    }

    // 3. 카드 작업자에 속해있는지
    const alrealyworker = await queryRunner.manager.findOne(CardWorkers, {
      where: {
        cards: { id },
        boardmember: { id: isBoardMember.id}
      }
    })

    if(!alrealyworker) {
        throw new Error("삭제 하려는 유저가 없습니다.")
    }

    // 4. 카드 작업자에 삭제
    await queryRunner.manager.remove(CardWorkers, alrealyworker)

    await this.notificationsService.sendNotification({
      name,
      type: '담당자 지정 해제',
      message: `카드 담당자가 지정 해제 되었습니다: ${name}`,
    })

    await queryRunner.commitTransaction(); // 트랜잭션 종료

  } catch(error) {
    await queryRunner.rollbackTransaction();
    console.log("담당자 지정 해제 에러:", error)
    throw new InternalServerErrorException(
      "담당자 지정 해제 중 오류가 발생했습니다.",
    );

  } finally {
    await queryRunner.release(); 
  }
  }





  // 카드 순서 변경 및 이동 API
  async swapOrder(id: number, newOrder: number){

    // 1. 바꾸려는 카드 찾기
    const cardToChange = await this.cardsRepository.findOne({
      where: {
        id
      }
    });

    // .2 새로운 순서에 해당하는 카드 찾기
    const cardAtNewOrder = await this.cardsRepository.findOne({
      where: { orderByCards: newOrder }
    })
    console.log(cardAtNewOrder.orderByCards)

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
    // 두 칼럼 순서 스왑
    if(cardToChange && cardAtNewOrder) {
      // 여기서 스왑할때만 락 걸음
      
      await queryRunner.manager
      .getRepository(Cards)
      .createQueryBuilder('cards')
      .where("id = :id", { id })
      .setLock("pessimistic_read")
      .update(Cards)
      .set({ orderByCards: newOrder})
      .execute()
      
      await queryRunner.manager
      .getRepository(Cards)
      .createQueryBuilder('cards')
      .where("id = :id", { id: cardAtNewOrder.id})
      .setLock("pessimistic_read")
      .update(Cards)
      .set({ orderByCards: cardToChange.orderByCards })
      .execute() 
    } 
    

     await queryRunner.commitTransaction(); 

    } catch(error) {
      await queryRunner.rollbackTransaction();
      console.log("카드 순서 변경 에러:", error)
      throw new InternalServerErrorException(
        "카드 순서 변경 중 오류가 발생했습니다.",
      );
      
    } finally {
      
    console.log(queryRunner.isReleased)

      if(!queryRunner.isReleased) {

        await queryRunner.release();
      }
    }
  }

}