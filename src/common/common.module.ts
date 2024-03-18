import { Module } from "@nestjs/common"
import { CommonService } from "./common.service";
import { CommonController } from "./common.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BaseModel } from "./entities/basemodel.entitiy";

@Module({
  imports: [TypeOrmModule.forFeature([BaseModel])],

  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
