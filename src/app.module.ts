import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ENV_DB_DATABASE_KEY, ENV_DB_HOST_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY } from "./common/const/env-keys.const";
import { Board } from "./boards/entities/board.entity";
import { Users } from "./users/entities/user.entity";
import { CardWorker } from "./cards/entities/cardworker.entity";
import { Cards } from "./cards/entities/card.entity";
import { CheckList } from "./cards/check_lists/entities/check_list.entity";
import { Columns } from "./columns/entities/column.entity";
import { BaseModel } from "./common/entities/basemodel.entitiy";
import { Check_current } from "./cards/check_lists/entities/Check_current.entity";
import { Comments } from "./cards/comments/entities/comment.entity";
import { AuthModule } from "./auth/auth.module";
import { BoardsModule } from "./boards/boards.module";
import { CardsModule } from "./cards/cards.module";
import { ColumnsModule } from "./columns/columns.module";
import { CommonModule } from "./common/common.module";
import { UsersModule } from "./users/users.module";
import { BoardMember } from "./boards/entities/boardmember.entity";


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [
        Board,
        Users,
        CardWorker,
        Cards,
        CheckList,
        Columns,
        BaseModel,
        Check_current,
        Comments,
        BoardMember
      ],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    BoardsModule,
    CardsModule,
    ColumnsModule,
    CommonModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
//adfasfsdaf
//adfasfadff
//adfasdf