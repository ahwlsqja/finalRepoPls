import { Module } from "@nestjs/common"
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { CommentsModule } from "./comments/comments.module";
import { CheckListsModule } from "./check_lists/check_lists.module";

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [CommentsModule, CheckListsModule],
})
export class CardsModule {}
