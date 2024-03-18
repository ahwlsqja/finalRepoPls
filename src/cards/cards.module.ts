import { Module } from "@nestjs/common"
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { CommentsModule } from "./comments/comments.module";
import { CheckListsModule } from "./check_lists/check_lists.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cards } from "./entities/card.entity";
import { CardWorker } from "./entities/cardworker.entity";
import { CheckList } from "./check_lists/entities/check_list.entity";
import { Check_current } from "./check_lists/entities/Check_current.entity";
import { Comments } from "./comments/entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cards, CardWorker, CheckList, Check_current, Comments])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
