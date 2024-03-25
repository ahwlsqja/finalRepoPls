
import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./entities/board.entity";
import { DataSource, Repository } from "typeorm";
import { BoardMember } from "./entities/boardmember.entity";
import { Users } from "src/users/entities/user.entity";
import { InvitationDto } from "./dto/invite.dto";
import { UsersService } from "src/users/users.service";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { MailService } from "src/mail/mail.service";
import _ from "lodash";
import { NotificationsService } from "src/notification/notifications.service";
import { UpdateBoardDto } from "./dto/board.update.dto";

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
    private dataSource: DataSource,
    private userServices : UsersService
  ){}

  // 보드 생성
  async createBoard(
    userId: number ,
    name: string,
    createBoardDto: CreateBoardDto) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction('READ COMMITTED'); 
      try{
      // 보드 생성

      const createdBoard = queryRunner.manager.create(Board, createBoardDto)  
      
      // 보드 저장
      const savedBoard = await queryRunner.manager.save(Board, createdBoard)
      // 푸시 알림 보내기
      try{
      await this.notificationsService.sendNotification({
        name,
        type: 'boardCreated',
        message: `보드가 생성되었습니다: ${savedBoard.title}.`,
      })
    }catch(error){
      console.log(error)
    }

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
  return await this.boardMemberRepository.findOne({
    where: { user: { id: userId }, board: { id: boardId } },
  });
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
async getAllBoardById(
  userId: number,
  name: string
  ) {
  const boardMembers = await this.boardMemberRepository.find({
    where: { user: { id: userId } },
    relations: ['board'],
  });

  await this.notificationsService.sendNotification({
    name,
    type: '현재 당신이 속한 모든 보드입니다.',
    message: `유저가 속한 모든 보드 조회`,
  })

  return boardMembers.map((boardMember) => boardMember.board);
}
  
// 보드 업데이트(호스트만 가능)
async updateBoard(userId: number,
   name: string,
   id: number, 
   updateBoardDto: UpdateBoardDto,
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

      // 푸시 알림 보내기
      await this.notificationsService.sendNotification({
        name,
        type: '보드 업데이트',
        message: `보드가 업데이트 되었습니다: ${board.title}.`,
      })

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
  async removeMyBoard(userId: number, name: string, id: number) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); 
    try{
      // 1. param로 만든 id에 따른 Board 찾기
      const board = await queryRunner.manager.findOne(Board,{
        where: { id },
        relations: ['boardmember']
      })

      if(!board) {
        throw new NotFoundException('해당 보드를 찾을 수 없습니다.');
      }

      // 2. 호스트이고 보드 맴버에 속해있는 보드 맴버만 필터링
      const isUserHost = board.boardmember.some(
        boardmember => boardmember.userId === userId && boardmember.isCreateUser);
      if (!isUserHost) {
      throw new NotFoundException('삭제 권한이 없습니다.');
      }

      // 3. 삭제 대신 isDeleted 상태로 만듬.
      await queryRunner.manager.update(Board,id, {
        isDeleted: true,
        deletedAt: new Date(),
      });
      // 4. 캐시에 삭제된 보드를 보관
      const deleteCacheKey = `deletedBoard:${id}`;
      const deletedBoardInfo = {
        userId,
        id
      }
      await this.cacheManager.set(deleteCacheKey, deletedBoardInfo, 60*60*24*30)


      // 5. 푸시 알림 보내기
      await this.notificationsService.sendNotification({
        name,
        type: 'boardDelete',
        message: `보드가 삭제되었습니다`,
      })

      // 6. 트랜잭션 완료 및 종료
      await queryRunner.commitTransaction(); // 트랜잭션 종료
      return { status: 201, message: '보드 삭제 성공'};
  }catch(error) {
      await queryRunner.rollbackTransaction();
      return { status: 500, message: '보드 삭제 실패'};
    } finally {
      await queryRunner.release(); 
    }
  }


  // 휴지통 복구
  async restoreMyBoard(userId: number, id: number, name: string) {
    const deleteCacheKey = `deletedBoard:${id}`;
    const deletedBoardInfo = await this.cacheManager.get<{userId: number, id: number}>(deleteCacheKey);

    if(!deletedBoardInfo || deletedBoardInfo.userId !== userId) {
      throw new NotFoundException('복구 할 수 없습니다.')
    }

    await this.cacheManager.del(deleteCacheKey)
    // 3. isDeleted 상태 바뀢기.
    await this.boardRepository.update(id, {
      isDeleted: false,
      deletedAt: null,
    });

    await this.notificationsService.sendNotification({
      name,
      type: '삭제한 보드 복구.',
      message: `삭제한 보드가 복구되었습니다.`,
    })
  }

  // 보드에 맴버 초대
  async invite(
    boardId: number, 
    invitationDto: InvitationDto, 
    user: Users) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); 
    try{
      const { memberEmail } = invitationDto

      // 1. 로그인한 유저가 호스트인지 검사
      const userOnly = await this.usersService.findemail(user.email) // 현재 로그
      const boardOnly = await queryRunner.manager.findOne(Board, {
        where: { id: boardId },
        relations: ['boardmember', 'boardmember.user']
      });
      await this.checkUserIsHost(userOnly, boardOnly)
      if(!boardOnly) 
      {
        throw new Error('보드가 없습니다.')
      }

      // 2. 초대할려는 유저의 존재성 검사
      const invitedUser = await this.usersService.findemail(memberEmail)
      if(!invitedUser)
      {
        throw new Error("초대하려는 유저가 없습니다.")
      }

      // 3. 초대하려는 유저가 이미 초대되었는지 검사
      await this.alreadyInviteUser(invitedUser, boardOnly)
      

      // 4. 유저 초대
      await this.inviteMember(memberEmail, boardOnly.id)

      // 푸시 알림 보내기
      await this.notificationsService.sendNotification({
        name: user.name,
        type: `보드에 ${invitedUser.name}을 초대하였습니다`,
        message: `유저에게 초대 이메일을 보냈습니다.: ${memberEmail}.`,
      })

      await queryRunner.commitTransaction();
    }catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 유저가 이메일 인증시 초대해줌(보드에 대한 권한줌)
  async authenticateEmail(
    memberEmail: string,
    authenticateEmailCode: number
    ) {
    // 1. 캐시에서 인증 번호 꺼내서 확인
    const cacheValue = await this.cacheManager.get<{authenticateEmailCode: number, boardId: number}>(memberEmail);
   
    // 2. 인증 번호 검증
    if(!cacheValue) {
      throw new NotFoundException('해당 메일로 전송된 인증번호가 없습니다.')
    } else if (cacheValue.authenticateEmailCode !== authenticateEmailCode) {
      throw new UnauthorizedException('틀림')
    }

    // 3. 인증 성공하면 캐시 삭제함
    await this.cacheManager.del(memberEmail);

    // 트랜 잭션 시작함. //
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
    // 4. 유저 존재성 검사  
    const newBoardUser = await queryRunner.manager.findOneBy(Users , {email: memberEmail})

    if(!newBoardUser)
    {
      throw new Error("유저가 없습니다. 권한을 부여할 수 없습니다. 다시 시도해주세요")
    }

    // 5. 유저가 있으면 보드 맴버로 추가 - 캐시에서 가져온 BoardId를 사용함
    const HostUser = queryRunner.manager.create(BoardMember,
      {
      user: { id: newBoardUser.id },
      board: { id: cacheValue.boardId },
      isAccepted: true,
    });

    await this.boardMemberRepository.save(HostUser)

    // 푸시 알림 보내기
    await this.notificationsService.sendNotification({
      name: newBoardUser.name,
      type: '보드 수락',
      message: `${newBoardUser.name}님이 성공적으로 초대되었습니다.`,
    })
    

    await queryRunner.commitTransaction();
    return HostUser;
    } catch(error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  // 유저가 그 보드의 호스트 인지 검사
  async checkUserIsHost(user: Users, board: Board){
    const compared = await this.boardMemberRepository.findOne({
      where: { 
            userId: user.id, 
            boardId: board.id
          },
    });

    if(!compared || compared.isCreateUser == false)
    {
      throw new Error("보드 호스트가 아닙니다.")
    }

    return compared
  }


  // 보드의 속해있는 유저인지 검사
  async alreadyInviteUser(user: Users, board: Board)
  {
    const compared = await this.boardMemberRepository.findOne({
      where: { 
            userId: user.id, 
            boardId: board.id
          },
    });

    if(compared)
    {
      throw new Error('이미 초대된 유저입니다.')
    }
  }

  // 맴버 초대
  async inviteMember(memberEmail: string, boardId: number){
    // 1. 인증번호 생성
    const authenticateEmailCode = this.generateRandomNumber();

    // 2. 이메일 인증하고 초대할 때 쓸려고 boardId 캐싱
    const cacheValue = {
      authenticateEmailCode,
      boardId
    }
    // 캐싱은 {memberEmail: cacheValue} 로 레디스에 저장 
    await this.cacheManager.set(memberEmail, cacheValue, 60*60*24*30);

    // 3. 이메일로 인증번호 보냄
    await this.sendCode(memberEmail, authenticateEmailCode)
  }

  // 이메일 보내기
  async sendCode(memberEmail: string, authenticateEmailCode: number) {
    await this.mailService.sendauthenticateEmailCodeToEmail(memberEmail, authenticateEmailCode)
    return authenticateEmailCode
  }

  
  private generateRandomNumber(): number {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }



  // 유저가 그 보드의 호스트 인지 검사
  async checkUserIsHostForGuard(userId: number, boardId: number){
    const compared = await this.boardMemberRepository.findOne({
      where: { 
            userId, 
            boardId
          },
    });

    if(!compared || compared.isCreateUser == false)
    {
      throw new Error("보드 호스트가 아닙니다.")
    }

    return compared
  }
  
}
