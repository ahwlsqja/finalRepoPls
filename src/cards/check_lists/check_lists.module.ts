import { Module } from "@nestjs/common"
import { CheckListsService } from "./check_lists.service";
import { CheckListsController } from "./check_lists.controller";
import { CheckList } from "./entities/check_list.entity";
import { Check_current } from "./entities/Check_current.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CheckList, Check_current])],
  controllers: [CheckListsController],
  providers: [CheckListsService],
})
export class CheckListsModule {}
