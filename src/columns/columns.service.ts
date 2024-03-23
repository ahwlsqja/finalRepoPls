// columns.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { Columns } from './entities/column.entity';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { NotificationsService } from 'src/notification/notifications.service';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Columns)
    private columnsRepository: Repository<Columns>,
    private notificationsService: NotificationsService,
    private dataSource: DataSource,
  ) {}


  // 컬럼 생성
  async create(boardId: number, name: string, createColumnDto: CreateColumnDto, orderByColumns : number) {
    
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{

      const { title, color } = createColumnDto;

      // 1. 컬럼 생성
     const newColumn = this.columnsRepository.create({
        boardId,
        title,
        color,
        orderByColumns,
      });
      // 2. 컬럼 저장
      await this.columnsRepository.save(newColumn);

      await this.notificationsService.sendNotification({
        name,
        type: '컬럼 생성',
        message: `칼럼이 성공적으로 생성되었습니다: ${title}`,
      })

      return newColumn;

      } catch(error) {
        await queryRunner.rollbackTransaction();
        return { status: 500, message: '칼럼 생성 실패'}
      } finally {
        await queryRunner.release()
      }
  }

  // 모든 칼럼 찾기
  async findAll(boardId: number) {
    const column = await this.columnsRepository
    .createQueryBuilder('columns') 
    .where('columns.boardId = :boardId', { boardId })
    .leftJoinAndSelect('columns.cards', 'cards') // 칼럼이 카드이 없을 수도잇어서 left씀
    .getRawMany();

    return column;
  }


  // 특정 칼럼 찾기
  async findColumns(id: number) {
    return await this.verifyColumnById(id);
  }


  // 칼럼 업데이트
  async update(id: number, name: string, updateColumnDto: UpdateColumnDto){
    const updateColumn = await this.columnsRepository.update({ id }, updateColumnDto)
    await this.notificationsService.sendNotification({
      name,
      type: '컬럼 수정',
      message: `칼럼이 성공적으로 업데이트 되었습니다`,
    })
    return {
      title: updateColumnDto.title,
      color: updateColumnDto.color
    };

    
  }


  // 칼럼 삭제
  async remove(id: number, name: string){
    
    const columnToRemove = await this.columnsRepository.findOneBy({ id })
    if(!columnToRemove) {
      throw new Error('찾으려는 컬럼이 없습니다,')
    }

    const orderByToRemove = columnToRemove.orderByColumns;

    // 컬럼 삭제
    await this.columnsRepository.remove(columnToRemove);

    // 삭제된 orderByColumns보다 큰 모든 칼럼 찾기
    const columnsToUpdate = await this.dataSource
      .getRepository(Columns)
      .createQueryBuilder('columns')
      .where(`columns.orderByColumns > :orderByToRemove`, { orderByToRemove })
      .orderBy('columns.orderByColumns', 'ASC')
      .getMany();


    for(const column of columnsToUpdate) {
      column.orderByColumns -= 1;
      await this.columnsRepository.save(column)
    }
    
    // 푸시 알림 보내기
    await this.notificationsService.sendNotification({
      name,
      type: '컬럼 삭제',
      message: `${columnToRemove.title}칼럼이 성공적으로 삭제되었습니다.`,
    })
  }


  // 칼럼 순서 바꾸기
  async swapOrder(id: number, name:string, newOrder: number){

    // 바꾸려는 칼럼 찾기
    const columnToChange = await this.findColumns(id);

    // 새로운 순서에 해당하는 칼럼 찾기
    const columnAtNewOrder = await this.columnsRepository.findOne({
      where: { orderByColumns: newOrder }
    })
    console.log(columnAtNewOrder.orderByColumns)

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
    // 두 칼럼 순서 스왑
    if(columnToChange && columnAtNewOrder) {
      // 여기서 스왑할때만 락 걸음
      
      await queryRunner.manager
      .getRepository(Columns)
      .createQueryBuilder('columns')
      .where("id = :id", { id })
      .setLock("pessimistic_read")
      .update(Columns)
      .set({ orderByColumns: newOrder})
      .execute()
      
      await queryRunner.manager
      .getRepository(Columns)
      .createQueryBuilder('columns')
      .where("id = :id", { id: columnAtNewOrder.id})
      .setLock("pessimistic_read")
      .update(Columns)
      .set({ orderByColumns: columnToChange.orderByColumns })
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

  // 개수세는 함수
  async count(boardId: number): Promise<number> {
    const result = await this.columnsRepository
      .createQueryBuilder('column')
      .where('column.boardId = :boardId', { boardId })
      .select('COUNT(column.orderByColumns)', 'total_column_count')
      .getRawOne();
  
    return Number(result.total_column_count);
  }
  
  // column아이디로 조회
  private async verifyColumnById(id: number) {
    const column = await this.columnsRepository.findOne({
      where: { id },
      relations: { cards: true },
    });

    if(!column) {
      throw new NotFoundException('존재하지 않는 칼럼입니다.')
    }

    return column ;
  }

}