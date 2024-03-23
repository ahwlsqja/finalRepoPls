import { Module } from "@nestjs/common";
import { CommonService } from "./common.service";
import { CommonController } from "./common.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BaseModel } from "./entities/basemodel.entitiy";
import { SlackService } from "./slackMessage.service";

@Module({
  imports: [TypeOrmModule.forFeature([BaseModel])],

  controllers: [CommonController],
  providers: [CommonService, SlackService],
  exports: [SlackService]
})
export class CommonModule {}
