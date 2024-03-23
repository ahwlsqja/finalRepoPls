import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { CheckLists } from "./entities/checkList.entity";
import { Repository } from "typeorm";
import { Cards } from "../entities/card.entity";
import { CheckCurrent } from "./entities/checkCurrent.entity";
import { CurrentStatus } from "./types/checkCurrent-status.type";
import _ from "lodash";
import { UpdateCheckListDto } from "./dto/update-checkList.dto";
import { CreateCheckListDto } from "./dto/create-checkList.dto";
import { CreateCheckCurrentDto } from "./dto/create-checkCurrent.dto";
import { UpdateCheckCurrentDto } from "./dto/update-checkCurrent.dto";


@Injectable()
export class CheckListsService {
    constructor(
        @InjectRepository(CheckLists)
        private checkListsRepository: Repository<CheckLists>,
        @InjectRepository(Cards)
        private cardsRepository: Repository<Cards>,
        @InjectRepository(CheckCurrent)
        private checkCurrentRepository: Repository<CheckCurrent>,
    ) {}

    async createCheckList(
        boardId: number,
        columnId: number,
        cardId: number, 
        createCheckListDto: CreateCheckListDto
        ) {

        try {
            // 해당 카드의 마지막 orderByCheck 값을 가져옴
            const lastCheckList = await this.checkListsRepository.findOne({
                where: { cardId },
                order: { orderByCheck: 'DESC'}
            })
            
            // 새로운 체크리스트 생성 시 마지막 orderByCheck 값에 1을 더함
            const orderByCheck = lastCheckList ? lastCheckList.orderByCheck += 1 : 1

            const { title } = createCheckListDto
            const checkList = this.checkListsRepository.create({
                cardId,
                title,
                orderByCheck
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
            const { title } = updateCheckListDto;
            await this.getCheckListById(checkListId)
            const updatedCheckList = await this.checkListsRepository.save({
                id: checkListId,
                title
            })
            return updatedCheckList;
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

    async createCheckCurrent(
        boardId: number,
        columnId: number,
        cardId: number,
        checkListId: number,
        createCheckCurrentDto: CreateCheckCurrentDto
    ) {
        try {
            const { content, status } = createCheckCurrentDto
            const checkCrrent = this.checkCurrentRepository.create({
                checkListId,
                content,
                status
            })
            await this.checkCurrentRepository.save(checkCrrent)
            return checkCrrent;
        } catch (error) {
            throw new InternalServerErrorException(
                "할 일 생성 중 오류가 발생했습니다.",
              );
        }
    }

    async updateCheckCurrent(
        checkListId: number, 
        checkCurrentId: number,
        updateCheckCurrentDto: UpdateCheckCurrentDto
        ) {

        try {
            const { content, status } = updateCheckCurrentDto;
            await this.getCheckListById(checkListId)
            const updatedCheckCurrent = await this.checkCurrentRepository.save({
                id: checkCurrentId,
                checkListId,
                content,
                status
            })
            return updatedCheckCurrent;
        } catch (error) {
            throw new InternalServerErrorException(
                "할 일 수정 중 오류가 발생했습니다.",
              );
        }
    }

    async deleteCheckCurrent(
        checkListId: number,
        checkCurrentId: number
        ) {

        try {
            await this.getCheckListById(checkListId)
            return await this.checkCurrentRepository.delete({id: checkCurrentId})
        } catch (error) {
            throw new InternalServerErrorException(
                "할 일 삭제 중 오류가 발생했습니다.",
            );
        }
    }
}
