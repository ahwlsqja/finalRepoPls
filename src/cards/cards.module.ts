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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cards,
      CardWorkers,
      CheckLists,
      CheckCurrent,
      Comments,
      NotificationModule
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
