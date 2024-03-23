
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cards } from "./entities/card.entity";
import { DataSource, Repository } from "typeorm";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
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
    @InjectRepository(CardWorkers)
    private readonly cardWorkersRepository: Repository<CardWorkers>,
    private readonly notificationsService: NotificationsService,
    private readonly boardsService: BoardsService,
    private dataSource: DataSource,
  ) {}

  // 카드 상세 조회 #경복님이랑 +
  async getCardsByColumnId(columnId: number) {
    return await this.cardsRepository.findOne({
        where:{id: columnId,}
  });
  }

  async createCard(
    boardId: number, 
    columnId: number, 
    userId: number, 
    name: string,
    createCardDto: CreateCardDto
    ) {
  
    // 해당 칼럼의 마지막 orderByCards 값을 가져옴
    const lastCard = await this.cardsRepository.findOne({
      where: { columnId },
      order: { orderByCards: 'DESC' }, // 내림차순으로 정렬하여 가장 큰 값을 가져옴
    });

    const boardmembers = await this.boardsService.getBoardMember(userId, boardId)


    // 새로운 카드 생성 시 마지막 orderByCards 값에 1을 더함
    const orderByCards = lastCard ? lastCard.orderByCards += 1 : 1

    const { title, color, content, tag, endDate } = createCardDto;
    const card = this.cardsRepository.create({
      columnId,
      title,
      color,
      content,
      tag,
      endDate,
      orderByCards,
    });
    await this.cardsRepository.save(card);

    // 카드 담당자 지정
    const cardWorker = this.cardWorkersRepository.create({
      cards: card,
      boardmemberId: boardmembers.id,
    });
    await this.cardWorkersRepository.save(cardWorker);

    await this.notificationsService.sendNotification({
      name,
      type: '카드 생성',
      message: `카드가 생성되었습니다: ${card.title}.`,
    })
    
    return card;
  }

   // 카드 수정  
  async updateCard(id: number, name: string, updateCardDto: UpdateCardDto) {

    await this.cardsRepository.update({ id }, updateCardDto);

    await this.notificationsService.sendNotification({
      name,
      type: '카드 수정',
      message: `카드가 수정되었습니다: ${updateCardDto.title}.`,
    })
  }


  // 카드 삭제
  async deleteCard(id: number, name: string){
    
    const cardToRemove = await this.cardsRepository.findOneBy({ id })
    if(!cardToRemove) {
      throw new Error('찾으려는 카드이 없습니다,')
    }

    const orderByToRemove = cardToRemove.orderByCards;

    // 컬럼 삭제
    await this.cardsRepository.remove(cardToRemove);

    // 삭제된 orderByColumns보다 큰 모든 칼럼 찾기
    const cardToUpdate = await this.dataSource
      .getRepository(Cards)
      .createQueryBuilder('cards')
      .where(`cards.orderByCards > :orderByToRemove`, { orderByToRemove })
      .orderBy('cards.orderByCards', 'ASC')
      .getMany();


    for(const card of cardToUpdate) {
      card.orderByCards -= 1;
      await this.cardsRepository.save(card)
    }
    
    // 푸시 알림 보내기
    await this.notificationsService.sendNotification({
      name,
      type: '카드 삭제',
      message: `${cardToRemove.title}카드가 성공적으로 삭제되었습니다.`,
    })
  }

  // 작업자 할당  post? patch?
  async assignWorker (id: number, boardId: number, name: string, userId: number){
    const task = await this.cardsRepository.findOneBy({id});

    if(!task) {
        throw new NotFoundException('카드가 존재하지 않습니다.')
    }

    // 2. 초대할려는 유저의 존재성 검사
    const isBoardMember = await this.boardsService.getBoardMember(userId, boardId)
    if(!isBoardMember)
    {
      throw new Error("할당하려는 유저가 없습니다.")
    }

    // 3. 이미 카드 작업자에 속해있는지
    const alrealyworker = await this.cardWorkersRepository.findOne({
      where: {
        cards: { id },
        boardmember: { id: isBoardMember.id}
      }
    })
    if(alrealyworker)
    {
      throw new Error("이미 유저가 등록되었습니다.")
    }
    const card = await this.cardsRepository.findOne({
      where: {
        id: id,
      }
    })
    
      // 카드 담당자 지정
     const cardWorker = this.cardWorkersRepository.create({
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

  // 작업자 삭제
  async changeWorker (id: number, boardId: number, name: string, userId: number){
    // 1. 작업자를 헤재하려는 카드가 존재하는지 확인
    const task = await this.cardsRepository.findOneBy({id});

    if(!task) {
        throw new NotFoundException('카드가 존재하지 않습니다.')
    }

    // 2. 삭제하려는 유저의 존재성 검사
    const isBoardMember = await this.boardsService.getBoardMember(userId, boardId)
    if(!isBoardMember)
    {
      throw new Error("할당하려는 유저가 없습니다.")
    }

    // 3. 카드 작업자에 속해있는지
    const alrealyworker = await this.cardWorkersRepository.findOne({
      where: {
        cards: { id },
        boardmember: { id: isBoardMember.id}
      }
    })

    if(!alrealyworker){
        throw new Error("삭제 하려는 유저가 없습니다.")
    }

    // 3. 카드 작업자에 삭제
    await this.cardWorkersRepository.remove(alrealyworker)

    await this.notificationsService.sendNotification({
      name,
      type: '카드 작업자 삭제',
      message: `카드작업자가 등록 해제 되었습니다: ${name}`,
    })
  }





  // 카드 순서 바꾸기
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

    } catch(err) {
      await queryRunner.rollbackTransaction();
      console.log(err)
      
    } finally {
      
    console.log(queryRunner.isReleased)

      if(!queryRunner.isReleased) {

        await queryRunner.release();
      }
    }
  }

}


