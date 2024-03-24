import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { CheckLists } from "./entities/checkList.entity";
import { DataSource, Repository } from "typeorm";
import { Cards } from "../entities/card.entity";
import { CheckCurrent } from "./entities/checkCurrent.entity";
import { CurrentStatus } from "./types/checkCurrent-status.type";
import _ from "lodash";
import { UpdateCheckListDto } from "./dto/update-checkList.dto";
import { CreateCheckListDto } from "./dto/create-checkList.dto";
import { CreateCheckCurrentDto } from "./dto/create-checkCurrent.dto";
import { UpdateCheckCurrentDto } from "./dto/update-checkCurrent.dto";
import { NotificationsService } from "src/notification/notifications.service";


@Injectable()
export class CheckListsService {
    constructor(
        @InjectRepository(CheckLists)
        private checkListsRepository: Repository<CheckLists>,
        @InjectRepository(Cards)
        private cardsRepository: Repository<Cards>,
        @InjectRepository(CheckCurrent)
        private checkCurrentRepository: Repository<CheckCurrent>,
        private readonly notificationsService: NotificationsService,
        private dataSource: DataSource,
    ) {}
    
    // 체크 리스트 생성
    async createCheckList(
        boardId: number,
        name: string,
        columnId: number,
        cardId: number, 
        createCheckListDto: CreateCheckListDto
        ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED'); 

        try {
            // 1. 해당 카드의 마지막 orderByCheck 값을 가져옴
            const lastCheckList = await queryRunner.manager.findOne(CheckLists,{
                where: { cardId },
                order: { orderByCheck: 'DESC'}
            })
            
            // 2. 새로운 체크리스트 생성 시 마지막 orderByCheck 값에 1을 더함
            const orderByCheck = lastCheckList ? lastCheckList.orderByCheck += 1 : 1

            const { title } = createCheckListDto

            // 3. 체크 리스트 생성
            const checkList = queryRunner.manager.create(CheckLists,{
                cardId,
                title,
                orderByCheck
            }) 

            // 4. 체크 리스트 저장
            await queryRunner.manager.save(checkList)

            //5. 체크리스트 제목을 입력하고, 처음에 생성할 때 기본적으로 3개의 할일 목록이 함께 생성되게 한다.
            const defaultCurrents = ['1번째 할일', '2번째 할일', '3번째 할일'];
            for (const currentTitle of defaultCurrents) {
                const current = queryRunner.manager.create(CheckCurrent,{
                    checkListId: checkList.id,
                    content: currentTitle,
                    status: CurrentStatus.BACKLOG
                });
                await queryRunner.manager.save(CheckCurrent,current);
              }

            await this.notificationsService.sendNotification({
                name,
                type: '체크리스트 생성',
                message: `체크리스트를 생성하였습니다. ${title}`,
              })

            await queryRunner.commitTransaction(); // 트랜잭션 종료

            return { status: 201, message: '체크리스트 생성 성공', checkList};


        } catch(error) {
            await queryRunner.rollbackTransaction();
            return { status: 500, message: '체크 리스트 생성 실패'};
          } finally {
            await queryRunner.release(); 
          }
    }

    async updateCheckList(
        checkListId: number, 
        name: string,
        updateCheckListDto: UpdateCheckListDto
        ) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction('READ COMMITTED'); 
            try{

            const { title } = updateCheckListDto;
            
            // 1. 수정할 체크리스트가 있는지 확인
            await this.getCheckListById(checkListId)

            // 2. 체크리스트 업데이트
            const updatedCheckList = await queryRunner.manager.save(CheckLists,{
                id: checkListId,
                title
            })

            // 3. 푸쉬 알림 보내기
            await this.notificationsService.sendNotification({
                name,
                type: '체크리스트 수정',
                message: `체크리스트를 수정하였습니다. ${title}`,
              })
            await queryRunner.commitTransaction(); // 트랜잭션 종료

            return { status: 201, message: '체크리스트 수정 성공', updatedCheckList};

        } catch(error) {
            await queryRunner.rollbackTransaction();
            return { status: 500, message: '체크리스트 수정 실패'};
          } finally {
            await queryRunner.release(); 
          }
    }

    // 체크 리스트 삭제
    async deleteCheckList(checkListId: number, name:string) {

        try {
            // 1. 삭제할 체크리스트 있는지 확인
            await this.getCheckListById(checkListId)

            // 2. 체크 리스트 삭제하기
            await this.checkListsRepository.delete({id: checkListId})
            // 3. 푸쉬 알림 보내기
            await this.notificationsService.sendNotification({
                name,
                type: '체크리스트 삭제',
                message: `체크리스트를 삭제하였습니다. `,
              })

            return { status: 201, message: '체크리스트 삭제 성공'};
            
        } catch (error) {
            throw new InternalServerErrorException(
                "체크리스트 삭제 중 오류가 발생했습니다.",
            );
        }
    }

    // 체크리스트 조회
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




    // 할일 생성
    async createCheckCurrent(
        boardId: number,
        columnId: number,
        cardId: number,
        name: string,
        checkListId: number,
        createCheckCurrentDto: CreateCheckCurrentDto
    ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED'); 
        try{
            const { content, status } = createCheckCurrentDto
            // 1.할일 생성
            const checkCrrent = queryRunner.manager.create(CheckCurrent,{
                checkListId,
                content,
                status
            })

            // 2. 할일 저장
        
            await queryRunner.manager.save(CheckCurrent, checkCrrent)

            // 3. 푸쉬 알림 보내기

            await this.notificationsService.sendNotification({
                name,
                type: '할일 생성',
                message: `할일을 생성하였습니다. ${content}`,
              })
            
            await queryRunner.commitTransaction(); // 트랜잭션 종료

            return { status: 201, message: '할일 생성 성공', checkCrrent};
              

        } catch(error) {
        await queryRunner.rollbackTransaction();
        return { status: 500, message: '할일 생성 실패'};
        } finally {
        await queryRunner.release(); 
  }
    }

    async updateCheckCurrent(
        checkListId: number, 
        checkCurrentId: number,
        name: string,
        updateCheckCurrentDto: UpdateCheckCurrentDto
        ) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction('READ COMMITTED'); 
        
            try{

            const { content, status } = updateCheckCurrentDto;
            await this.getCheckListById(checkListId)
            const updatedCheckCurrent = await this.checkCurrentRepository.save({
                id: checkCurrentId,
                checkListId,
                content,
                status
            })
            
            // 푸시 알림 보내기
        await this.notificationsService.sendNotification({
        name,
        type: '할일 업데이트',
        message: `할일이 업데이트 되었습니다: ${content}.`,
         })


        await queryRunner.commitTransaction(); // 트랜잭션 종료
        return { status: 201, message: '할일 수정 성공', updatedCheckCurrent};

  
        } catch(error) {
        await queryRunner.rollbackTransaction();
        return { status: 500, message: '할일 수정 실패'};
        } finally {
         await queryRunner.release(); 
        }
    }

    async deleteCheckCurrent(
        checkListId: number,
        checkCurrentId: number,
        name: string,

        ) {

        try {
            await this.getCheckListById(checkListId)
            // 푸시 알림 보내기
            await this.notificationsService.sendNotification({
            name,
            type: '할일 삭제',
            message: `할일이 삭제 되었습니다.`,
             })
             await this.checkCurrentRepository.delete({id: checkCurrentId})
            return { status: 201, message: '할일 삭제 성공'};

        } catch (error) {
            throw new InternalServerErrorException(
                "할 일 삭제 중 오류가 발생했습니다.",
            );
        }
    }
}
