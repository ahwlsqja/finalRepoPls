import { Module } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cards } from "./entities/card.entity";
import { CardWorkers } from "./entities/cardworker.entity";
import { Comments } from "./comments/entities/comment.entity";
import { CheckCurrent } from "./check_lists/entities/checkCurrent.entity";
import { CheckLists } from "./check_lists/entities/checkList.entity";
import { NotificationModule } from "src/notification/notification.module";
import { BoardsModule } from "src/boards/boards.module";
import { Board } from "src/boards/entities/board.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board,
      Cards,
      CardWorkers,
      CheckLists,
      CheckCurrent,
      Comments,
    ]),
    BoardsModule,
    NotificationModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
