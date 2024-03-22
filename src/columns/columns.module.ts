import { Module } from "@nestjs/common";
import { ColumnsService } from "./columns.service";
import { ColumnsController } from "./columns.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Columns } from "./entities/column.entity";
import { BoardsModule } from "src/boards/boards.module";

@Module({
  imports: [TypeOrmModule.forFeature([Columns]), BoardsModule],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
