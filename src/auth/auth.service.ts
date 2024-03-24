import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/users/types/userRole.type';
import { ENV_HASH_ROUND_KEY, ENV_SSHKRY_KEY } from 'src/common/const/env-keys.const';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(Users) private usersRepository : Repository<Users>,
    private readonly jwtService : JwtService,
    private readonly mailservice : MailService,
    private configService : ConfigService ){}

    async create(createUserDto: CreateUserDto) {
        const { email, password, passwordConfirm, name, sshKey } = createUserDto;
        const hashkey = this.configService.get(Number[ENV_HASH_ROUND_KEY]);
        const salt = await genSalt(hashkey);
        const hashpassword = await hash(password, salt);
        const user = await this.findemail(email);
        
    
        if(user){
          throw new BadRequestException("이미 유저가 존재합니다.");
        }
    
        if(password !== passwordConfirm){
          throw new UnauthorizedException("패스워드가 확인과 일치하지 않습니다.");
        }

        if (
          !email.includes("@naver.com") &&
          !email.includes("@daum.net") &&
          !email.includes("@google.com") &&
          !email.includes("@gmail.com") &&
          !email.includes("@googlemail.com") &&
          !email.includes("@hanmail.net") &&
          !email.includes("@icloud.com") &&
          !email.includes("@cyworld.com") &&
          !email.includes("@kakao.com") &&
          !email.includes("@mail.com") &&
          !email.includes("@narasarang.or.kr") &&
          !email.includes("@tistory.com")
      ) {
        throw new BadRequestException("이메일 조건이 맞지 않습니다.");
      }


        if(sshKey){
          await this.sshkey(sshKey);
          
          const aduser = this.usersRepository.create({
            email,
            password : hashpassword,
            name,
            sshKey,
            role : Role.Admin,
            IsVaildated : true
          });
          
          await this.usersRepository.save(aduser);

          delete aduser.password;
          delete aduser.sshKey;
          delete aduser.emailtoken;
          delete aduser.IsVaildated;
          return aduser;

        } else if (!sshKey) {
          const randomNum = () => {
            return Math.floor(1000 + Math.random() * 9000);
          };
          
          const token = String(randomNum());
          
          const users = this.usersRepository.create({
              email,
              password : hashpassword,
              name,
              emailtoken : token
          });
  
          await this.usersRepository.save(users);
          delete users.password;
          delete users.emailtoken;
          delete users.sshKey;
          await this.sendemail(email, token);
          return users;
        }
      }

      async sshkey (sshKey : string){
        const ssykeys = this.configService.get<string>(ENV_SSHKRY_KEY);

        if(sshKey !== ssykeys){
          throw new UnauthorizedException("키가 일치하지 않습니다.");
        }

        return ssykeys;
      }
      
      async login(email: string, password: string) {
        const user = await this.usersRepository.findOne({
          select: ['id', 'email', 'password'],
          where: { email },
        });
    
        if(user === null){
          throw new BadRequestException("유저가 존재하지 않습니다.");
        }
    
        if (!(await compare(password, user.password))) {
          throw new BadRequestException('비밀번호를 확인해주세요.');
        }
    
        const payload = { email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }


      async findemail( email : string ){
        return await this.usersRepository.findOne({ where : { email } });
      }

      async sendemail( email : string, emailtoken : string ){
        await this.mailservice.sendemailtoken(email, emailtoken);
      }
}
