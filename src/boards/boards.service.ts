
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./entities/board.entity";
import { Brackets, DataSource, Repository } from "typeorm";
import { BoardMember } from "./entities/boardmember.entity";
import { Users } from "src/users/entities/user.entity";
import { InvitationDto } from "./dto/invite.dto";

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    private dataSource: DataSource,
  ){}

  // 보드 생성
  async createBoard(
    userId: number ,
    createBoardDto: CreateBoardDto) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction('READ COMMITTED'); 
      try{
      // 보드 생성
      const createdBoard = queryRunner.manager.create(Board, createBoardDto)  
      
      // 보드 저장
      const savedBoard = await queryRunner.manager.save(Board, createdBoard)

      // 보드 생성한 사용자 권한 부여하기
      const HostUser = queryRunner.manager.create(
        BoardMember,
        {
        user: { id: userId },
        board: { id: savedBoard.id },
        isCreateUser: true
      });

      // Host 유저 저장
      await queryRunner.manager.save(BoardMember, HostUser);
      await queryRunner.commitTransaction(); // 트랜잭션 종료
      return { status: 201, message: '보드 생성 성공'};

  } catch(error) {
    await queryRunner.rollbackTransaction();
    return { status: 500, message: '보드 생성 실패'};
  } finally {
    await queryRunner.release(); 
  }
}

// 보드 유저인지 유효성 검사 api
async getBoardMember(userId: number, boardId: number){
  return await this.boardMemberRepository.createQueryBuilder('BoardMember')
  .where('BoardMember.userId = :userId', { userId })
  .andWhere('BoardMember.boardId = :boardId', { boardId })
  .andWhere(new Brackets(qb => {
    qb.where('BoardMember.isAccepted = :isAccepted', { isAccepted: true })
      .orWhere('BoardMember.isCreateUser = :isCreateUser', { isCreateUser: true});
  }))
  .getOne();
}


// 특정 보드 조회
async getBoardByBoardId(id: number) {
  const board = await this.boardMemberRepository.findOneBy({ id });
  if(!board) {
    throw new NotFoundException('해당 보드를 찾을 수 없습니다.')
  }
  return board
}

// 유저가 속한 모든 보드 조회
async getAllBoardById(userId: number) {
  const boardMembers = await this.boardMemberRepository.find({
    where: { user: { id: userId } },
    relations: ['board'],
  });

  return boardMembers.map((boardMember) => boardMember.board);
}
  
// 보드 업데이트(호스트만 가능)
async updateBoard(userId: number,
   id: number, 
   updateBoardDto: CreateBoardDto,
   ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); 

    try{
      // 1. param로 만든 id에 따른 Board 찾기
      const board = await queryRunner.manager.findOne(Board,{
        where: { id },
        relations: ['boardmember', 'boardmember.user']
      })

      if(!board) {
        throw new NotFoundException('해당 보드를 찾을 수 없습니다.');
      }


      // 2. 로그인한 유저가 호스트인 보드만 필터링 
      const isUserHost = board.boardmember.some(
        (member) => (member.user.id === userId && member.isCreateUser)
      )

      if(!isUserHost) {
        throw new NotFoundException('수정 권한이 없습니다.')
     }

      // 3.board 객체의 속성 업데이트 
      Object.assign(board, updateBoardDto);

      // 4. board title에 저장
      await queryRunner.manager.save(Board, board);
      await queryRunner.commitTransaction(); // 트랜잭션 종료
      return { status: 201, message: '보드 수정 성공'};
    }catch(error) {
      await queryRunner.rollbackTransaction();
      return { status: 500, message: '보드 수정 실패'};
    } finally {
      await queryRunner.release(); 
    }
  }

  // 자신의 보드만 삭제
  async removeMyBoard(userId: number, id: number) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); 

    try{
      // 1. param로 만든 id에 따른 Board 찾기
      const board = await queryRunner.manager.findOne(Board,{
        where: { id },
      })

      if(!board) {
        throw new NotFoundException('해당 보드를 찾을 수 없습니다.');
      }

      // 2. 호스트이고 보드 맴버에 속해있는 보드 맴버만 필터링
      const isUserHost = board.boardmember.some(
        (boardmember) => boardmember.user.id === userId && boardmember.isAccepted);

      if (!isUserHost) {
      throw new NotFoundException('삭제 권한이 없습니다.');
      }

      // 3. 삭제
      await queryRunner.manager.delete(Board,id);

      // 4. 트랜잭션 완료 및 종료
      await queryRunner.commitTransaction(); // 트랜잭션 종료
      return { status: 201, message: '보드 삭제 성공'};
  }catch(error) {
      await queryRunner.rollbackTransaction();
      return { status: 500, message: '보드 삭제 실패'};
    } finally {
      await queryRunner.release(); 
    }
  }

  // // 보드에 맴버 초대
  // async invite(boardId: number, userId: number, invitationDto: InvitationDto, user: Users) {
  //   try{
  //     const { memberEmail } = invitationDto
  //     const userOnly: Users = await this.get
  //   }
  // }
}
