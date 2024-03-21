import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { CheckList } from "./entities/checkList.entity";
import { Repository } from "typeorm";
import { Cards } from "../entities/card.entity";
import { CheckCurrent } from "./entities/checkCurrent.entity";
import { CurrentStatus } from "./types/checkCurrent-status.type";
import _ from "lodash";
import { UpdateCheckListDto } from "./dto/update-checkList.dto";


@Injectable()
export class CheckListsService {
    constructor(
        @InjectRepository(CheckList)
        private checkListsRepository: Repository<CheckList>,
        @InjectRepository(Cards)
        private cardsRepository: Repository<Cards>,
        @InjectRepository(CheckCurrent)
        private checkCurrentRepository: Repository<CheckCurrent>,
    ) {}

    async createCheckList(
        cardId: number, 
        title: string
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

            const checkList = this.checkListsRepository.create({
                cardId,
                title
            })
            await this.checkListsRepository.save(checkList)

              // 체크리스트 제목을 입력하고, 처음에 생성할 때 기본적으로 3개의 할일 목록이 함께 생성되게 한다.
              const defaultCurrents = ['1번째 할일', '2번째 할일', '3번째 할일'];
              for (const currentTitle of defaultCurrents) {
                  const current = this.checkCurrentRepository.create({
                      checkListId: checkList.id,
                      content: currentTitle,
                      status: CurrentStatus.BACKLOG
                  });
                  await this.checkCurrentRepository.save(current);
              }

            return checkList;
        } catch (error) {
            throw new InternalServerErrorException(
                "체크리스트 생성 중 오류가 발생했습니다.",
              );
        }
    }

    async updateCheckList(
        checkListId: number, 
        updateCheckListDto: UpdateCheckListDto
        ) {

        try {
            await this.getCheckListById(checkListId)
            return await this.checkListsRepository.update(
                { id: checkListId },
                updateCheckListDto
            )
        } catch (error) {
            throw new InternalServerErrorException(
                "체크리스트 수정 중 오류가 발생했습니다.",
              );
        }
    }

    async deleteCheckList(checkListId: number) {

        try {
            await this.getCheckListById(checkListId)
            return await this.checkListsRepository.delete({id: checkListId})
        } catch (error) {
            throw new InternalServerErrorException(
                "체크리스트 삭제 중 오류가 발생했습니다.",
              );
        }
    }

    async getCheckListById(checkListId: number) {
        const checkList = await this.checkListsRepository.findOne({
            where: {
                id: checkListId,
            }
        });
        if (_.isNil(checkList)) {
          throw new NotFoundException(
            "체크리스트를 찾을 수 없습니다.",
          );
        }
        return checkList
      }
}
