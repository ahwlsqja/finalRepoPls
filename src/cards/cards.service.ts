import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateCardDto } from "./dto/update-card.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Cards } from "./entities/card.entity";
import { Repository } from "typeorm";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import _ from "lodash";
import { number } from "joi";

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>
  ) { }

  // 카드 상세 조회 #경복님이랑 +
  async getCardsByColumnId(columnId: number) {
    return await this.cardsRepository.findOne({
        where:{id: columnId,}
  });
  }

  // 카드 생성
  async createCard(id: number, content: string) {
    await this.cardsRepository.save({
        id:id,
        content:content,
    });
  }

   // 카드 수정  
  async updateCard(id: number, title:string, content: string,) {
    await this.cardsRepository.update({ id }, { title,content },);
  }

  // 카드 삭제
  async deleteCard(id: number, userId: number) {
    await this.verifyCard(id, userId);
    await this.cardsRepository.delete({ id });
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

    task.userId=userId;

    return await this.cardsRepository.save(task);
  }

  // 작업자 변경  patch
  async changeWorker (columnId: number, userId: number){
    const changetask = await this.cardsRepository.findOneBy({columnId});
    
    if(!columnId) {
        throw new NotFoundException('컬럼이 존재하지 않습니다.')
    }

    changetask.userId=userId;
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


