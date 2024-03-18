
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { Module } from "@nestjs/common";

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
