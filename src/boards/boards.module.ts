import { Module } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { BoardsController } from "./boards.controller";
import { Board } from "./entities/board.entity";
import { BoardMember } from "./entities/boardmember.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MailModule } from "src/mail/mail.module";
import { UsersModule } from "src/users/users.module";
import { CommonModule } from "src/common/common.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember]),
  MailModule, UsersModule, NotificationModule],

  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService]
})
export class BoardsModule {}
