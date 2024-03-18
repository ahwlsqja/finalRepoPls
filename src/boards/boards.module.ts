import { Module } from "@nestjs/common"
import { BoardsService } from "./boards.service";
import { BoardsController } from "./boards.controller";
import { Board } from "./entities/board.entity";
import { BoardMember } from "./entities/boardmember.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember])],

  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
