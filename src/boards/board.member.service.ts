import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./entities/board.entity";
import { BoardMember } from "./entities/boardmember.entity";
import { DataSource, Repository } from "typeorm";
import { InvitationDto } from "./dto/invite.dto";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { MailService } from "src/mail/mail.service";
import _ from "lodash";


@Injectable()
export class BoardsMemberService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private dataSource: DataSource,
    private readonly mailService: MailService
  ){}



  // 맴버 초대
  async inviteMember(invitationDto: InvitationDto){
    const { memberEmail } = invitationDto;
    const authenticateEmailCode = this.generateRandomNumber();
    await this.cacheManager.set(memberEmail, authenticateEmailCode, 3600);
    await this.sendCode(memberEmail, authenticateEmailCode)
  }

  // 이메일 보내기
  async sendCode(memberEmail: string, authenticateEmailCode: number) {
    await this.mailService.sendauthenticateEmailCodeToEmail(memberEmail, authenticateEmailCode)
  }

  // 이메일 인증
  async authenticateEmail(memberEmail: string, authenticateEmailCode: number) {
    const cache_authenticate = await this.cacheManager.get<number>(memberEmail);
    if(_.isNil(cache_authenticate)) {
        throw new NotFoundException('해당 메일로 전송된 인증번호가 없습니다.');
    } else if (cache_authenticate !== authenticateEmailCode) {
        throw new UnauthorizedException('틀렸습니다.')
    } else {
        const boardMemberByEmail = await this.boardMemberRepository.find({
          where: { user: { email: memberEmail }}
        })
        await this.cacheManager.del(memberEmail)
    }



  }
  
  private generateRandomNumber(): number {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }

  // 초대받은 맴버 이메일 인증하면 상태 바꾸기

  // adfafd
}