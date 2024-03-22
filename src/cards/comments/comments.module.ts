import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { Module } from "@nestjs/common";
import { Comments } from "./entities/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationModule } from "src/notification/notification.module";
import { BoardsModule } from "src/boards/boards.module";
import { Columns } from "src/columns/entities/column.entity";
import { ColumnsModule } from "src/columns/columns.module";
import { CardsModule } from "../cards.module";
import { Cards } from "../entities/card.entity";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments, Cards]),
    NotificationModule,
    BoardsModule,
    ColumnsModule,
    CardsModule,
    CommonModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
