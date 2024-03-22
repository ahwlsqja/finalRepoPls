import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ENV_DB_DATABASE_KEY, ENV_DB_HOST_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY, ENV_REDIS_HOST_KEY, ENV_REDIS_PORT } from "./common/const/env-keys.const";
import { Board } from "./boards/entities/board.entity";
import { Users } from "./users/entities/user.entity";
import { CardWorkers } from "./cards/entities/cardworker.entity";
import { Cards } from "./cards/entities/card.entity";
import { CheckList } from "./cards/check_lists/entities/checkList.entity";
import { Columns } from "./columns/entities/column.entity";
import { BaseModel } from "./common/entities/basemodel.entitiy";
import { CheckCurrent } from "./cards/check_lists/entities/checkCurrent.entity";
import { Comments } from "./cards/comments/entities/comment.entity";
import { AuthModule } from "./auth/auth.module";
import { BoardsModule } from "./boards/boards.module";
import { CardsModule } from "./cards/cards.module";
import { ColumnsModule } from "./columns/columns.module";
import { CommonModule } from "./common/common.module";
import { UsersModule } from "./users/users.module";
import { BoardMember } from "./boards/entities/boardmember.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CacheConfigService } from "./cache/cacheConfig.service";
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./auth/guard/roles.guard";
import { BullModule } from "@nestjs/bull";
import { NotificationModule } from './notification/notification.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [
        Board,
        Users,
        CardWorkers,
        Cards,
        CheckList,
        Columns,
        BaseModel,
        CheckCurrent,
        Comments,
        BoardMember,
      ],
      synchronize: true,
      logging: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        redis: {
          host: process.env[ENV_REDIS_HOST_KEY],
          port: parseInt(process.env[ENV_REDIS_PORT]),
        }
      })
    }),
    AuthModule,
    BoardsModule,
    CardsModule,
    ColumnsModule,
    CommonModule,
    UsersModule,
    MailModule,
    NotificationModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard('jwt')
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule { }
