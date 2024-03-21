import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ENV_sshKey_KEY } from '../auth/const/env.keys.const';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(Users) private usersRepository : Repository<Users>,
    private readonly jwtService : JwtService,
    private readonly mailservice : MailService,
    private configService : ConfigService ){}

    async create(createUserDto: CreateUserDto) {
        const { email, password, passwordConfirm, name, sshKey } = createUserDto;
        const hashpassword = await hash(password, 10);
        const user = await this.findemail(email);
        
    
        if(user){
          throw new Error("이미 유저가 존재합니다.");
        }
    
        if(password !== passwordConfirm){
          throw new Error("패스워드가 확인과 일치하지 않습니다.");
        }

        if(sshKey){
          await this.sshkey(sshKey);
          const hashsshkey = await hash(sshKey, 10);
          
          const aduser = await this.usersRepository.create({
            email,
            password : hashpassword,
            name,
            sshKey : hashsshkey,
            IsAdmin : true
          });
          
          await this.usersRepository.save(aduser);

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
          await this.sendemail(email, token);
          return users;
        }
      }

      async sshkey (sshKey : string){
        const ssykeys = this.configService.get<string>(ENV_sshKey_KEY);

        if(sshKey !== ssykeys){
          throw new Error("키가 일치하지 않습니다.");
        }

        return ssykeys;
      }
      
      async login(email: string, password: string) {
        const user = await this.usersRepository.findOne({
          select: ['id', 'email', 'password'],
          where: { email },
        });
    
        if(user === null){
          throw new Error("유저가 존재하지 않습니다.");
        }
    
        if (!(await compare(password, user.password))) {
          throw new Error('비밀번호를 확인해주세요.');
        }

        // 가드를 거쳐야 하는 회원
        // if(!user.IsVaildated){
        //   throw new Error("이메일 인증을 거쳐야 하는 회원입니다.");
        // }
    
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


    //   async OAuthLogin({ @User() user : Users}) {
    //     // 1. 회원조회
    //     let user = await this.authrepository.findOne({ email: user.email }); //user를 찾아서
    
    //     // 2, 회원가입이 안되어있다면? 자동회원가입
    //     if (!user) user = await this.authrepository.create({ user }); //user가 없으면 하나 만들고, 있으면 이 if문에 들어오지 않을거기때문에 이러나 저러나 user는 존재하는게 됨.
    
    //     // 3. 회원가입이 되어있다면? 로그인(AT, RT를 생성해서 브라우저에 전송)한다
    //     await this.setRefreshToken({ user, res });
    //     res.redirect("리다이렉트할 url주소");
    //   }
    // }
      
}
