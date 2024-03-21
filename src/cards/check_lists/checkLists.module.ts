import { Module } from "@nestjs/common"
import { CheckListsService } from "./checkLists.service";
import { CheckListsController } from "./checkLists.controller";
import { CheckList } from "./entities/checkList.entity";
import { CheckCurrent } from "./entities/checkCurrent.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cards } from "../entities/card.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CheckList, CheckCurrent, Cards])],
  controllers: [CheckListsController],
  providers: [CheckListsService],
})
export class CheckListsModule {}
