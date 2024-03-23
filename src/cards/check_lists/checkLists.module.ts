import { Module } from "@nestjs/common"
import { CheckListsService } from "./checkLists.service";
import { CheckListsController } from "./checkLists.controller";
import { CheckLists } from "./entities/checkList.entity";
import { CheckCurrent } from "./entities/checkCurrent.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cards } from "../entities/card.entity";
import { CommonModule } from "src/common/common.module";
import { CardsModule } from "../cards.module";
import { ColumnsModule } from "src/columns/columns.module";
import { BoardsModule } from "src/boards/boards.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckLists, CheckCurrent, Cards]),
    NotificationModule,
    BoardsModule,
    ColumnsModule,
    CardsModule,
    CommonModule
  ],
  controllers: [CheckListsController],
  providers: [CheckListsService],
})
export class CheckListsModule {}
