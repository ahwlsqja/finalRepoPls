import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [JwtModule.registerAsync({
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET'),
    }),
    inject: [ConfigService],
  }),TypeOrmModule.forFeature([Users])],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
