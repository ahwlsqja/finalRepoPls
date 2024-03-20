import { Module } from "@nestjs/common"
import { BoardsService } from "./boards.service";
import { BoardsController } from "./boards.controller";
import { Board } from "./entities/board.entity";
import { BoardMember } from "./entities/boardmember.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BoardsMemberService } from "./board.member.service";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember]),
  MailModule],

  controllers: [BoardsController],
  providers: [BoardsService, BoardsMemberService],
})
export class BoardsModule {}
