import { Module } from "@nestjs/common";
import { CheckListsService } from "./check_lists.service";
import { CheckListsController } from "./check_lists.controller";

@Module({
  controllers: [CheckListsController],
  providers: [CheckListsService],
})
export class CheckListsModule {}
