import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { Module } from "@nestjs/common";
import { Comments } from "./entities/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comments]), NotificationModule],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
