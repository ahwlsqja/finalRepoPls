
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cards } from "./entities/card.entity";
import { Repository } from "typeorm";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import _ from "lodash";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { CardWorkers } from "./entities/cardworker.entity";
import { User } from "src/common/decorator/user.decorator";

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>,
    @InjectRepository(CardWorkers)
    private readonly cardWorkersRepository: Repository<CardWorkers>,
  ) {}

  // // 카드 상세 조회 #경복님이랑 +
  async getCardsByColumnId(columnId: number) {
    return await this.cardsRepository.findOne({
        where:{id: columnId,}
  });
  }

  // 카드 생성
  async createCard(
    boardId: number, 
    columnId: number, 
    userId: number, 
    createCardDto: CreateCardDto
    ) {
    // 해당 칼럼의 마지막 orderByCards 값을 가져옴
    const lastCard = await this.cardsRepository.findOne({
      where: { columnId },
      order: { orderByCards: 'DESC' }, // 내림차순으로 정렬하여 가장 큰 값을 가져옴
    });

    // 새로운 카드 생성 시 마지막 orderByCards 값에 1을 더함
    const orderByCards = lastCard ? lastCard.orderByCards += 1 : 1

    const { title, color, content, endDate } = createCardDto;
    const card = this.cardsRepository.create({
      columnId,
      title,
      color,
      content,
      endDate,
      tag: userId,
      orderByCards,
    });
    await this.cardsRepository.save(card);

    // 카드 담당자 지정
    const cardWorker = this.cardWorkersRepository.create({
      cards: card,
      boardmemberId: userId,
    });
    await this.cardWorkersRepository.save(cardWorker);

    return card;
  }


   // 카드 수정  

   async updateCard(
    id: number, 
    updateCardDto: UpdateCardDto
    ) {
      const updateCard = await this.cardsRepository.update({id}, updateCardDto)
      return {
        title:updateCardDto.title,
        color:updateCardDto.color,
        content:updateCardDto.content,
        endDate:updateCardDto.endDate
      }
    }
  //  const { title, color, content, endDate } = updateCardDto;

  //  const card = await this.cardsRepository.findOne(id);
   

  //  card.title = title;
  //  card.color = color;
  //  card.content = content;
  //  card.endDate = endDate;

  //     await this.cardsRepository.save(card);
  // }

  // async updateCard(
  //   id: number, 
  //   title:string, 
  //   content: string,
  //   updateCardDto: UpdateCardDto
  //   ) {
  //   await this.cardsRepository.update({ id }, { title,content },);
  // }


  // 카드 삭제
  async deleteCard(id: number) { 
    const deleteCard = await this.cardsRepository.findOneBy({id})

    if (!deleteCard) {
      throw new Error ('존재하지 않는 카드ID 입니다.')
    }

    await this.cardsRepository.remove(deleteCard)
    // await this.cardsRepository.delete({ id });
  }

  private async verifyCard(id: number, userId: number) {
    const card = await this.cardsRepository.findOneBy({
      id,
    });

    if (_.isNil(card) || BaseModel.id !== userId) {
      throw new NotFoundException(
        '카드를 찾을 수 없거나 수정/삭제할 권한이 없습니다.',
      );
    }
  }

  // 작업자 할당  post? patch?
  async assignWorker (columnId: number, userId: number){
    const task = await this.cardsRepository.findOneBy({columnId});

    if(!columnId) {
        throw new NotFoundException('컬럼이 존재하지 않습니다.')
    }

    //task.userId=userId;

    return await this.cardsRepository.save(task);
  }

  // 작업자 변경  patch
  async changeWorker (columnId: number, userId: number){
    const changetask = await this.cardsRepository.findOneBy({columnId});
    
    if(!columnId) {
        throw new NotFoundException('컬럼이 존재하지 않습니다.')
    }

    //changetask.userId=userId;
    return await this.cardsRepository.save(changetask);
  }

  // 칼럼 내 위치 변경  patch
  async changeOrderByCard(id: number, newOrderByCards: number, ){
    const findCard = await this.cardsRepository.findOneBy({id});

    if(!findCard){
      throw new NotFoundException('해당 카드가 존재하지 않습니다.')
    }

    if(newOrderByCards === findCard.orderByCards){
      return;
    }

    findCard.orderByCards = newOrderByCards;
    await this.cardsRepository.save(findCard);
  }

}


