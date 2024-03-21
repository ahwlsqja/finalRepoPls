import { Module } from "@nestjs/common"
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cards } from "./entities/card.entity";
import { CardWorker } from "./entities/cardworker.entity";
import { CheckList } from "./check_lists/entities/checkList.entity";
import { CheckCurrent } from "./check_lists/entities/checkCurrent.entity";
import { Comments } from "./comments/entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cards, CardWorker, CheckList, CheckCurrent, Comments])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
