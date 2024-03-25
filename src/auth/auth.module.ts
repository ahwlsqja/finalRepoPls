import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from 'src/mail/mail.module';


@Module({
  imports: [JwtModule.registerAsync({
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET'),
    }),
    inject: [ConfigService],
  }),TypeOrmModule.forFeature([Users]), MailModule],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports:[JwtStrategy, AuthService]
})
export class AuthModule {}