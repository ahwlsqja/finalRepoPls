import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdatehostDto } from 'src/users/dto/update-token';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(Users) private authrepository : Repository<Users>,
    private readonly jwtService : JwtService ){}

    async create(createUserDto: CreateUserDto) {
        const { email, password, passwordConfirm, name } = createUserDto;
        const hashpassword = await hash(password, 10);
        const user = await this.findemail(email);
    
        if(user){
          throw new Error("이미 유저가 존재합니다.");
        }
    
        if(password !== passwordConfirm){
          throw new Error("패스워드가 확인과 일치하지 않습니다.");
        }
    
        const users = this.authrepository.create({
            email,
            password : hashpassword,
            name
        });
        await this.authrepository.save(users);

        return users;
      }
      
      async login(email: string, password: string) {
        const user = await this.authrepository.findOne({
          select: ['id', 'email', 'password'],
          where: { email },
        });
    
        if(user === null){
          throw new Error("유저가 존재하지 않습니다.");
        }
    
        if (!(await compare(password, user.password))) {
          throw new Error('비밀번호를 확인해주세요.');
        }
    
        const payload = { email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
        
      }


      async tokenupdate(email : string, updatehostDto : UpdatehostDto) {
        const { IsVaildated } = updatehostDto;
        const user = await this.authrepository.findOne({ where : { email }});
    
        if(!user){
          throw new Error("유저가 존재하지 않습니다.");
        }
    
        if(user.IsVaildated !== IsVaildated){
          throw new Error("인증번호가 맞지 않습니다.");
        }
    
        if(user.IsVaildated){
          throw new Error("이미 호스트 인증을 받으셨습니다.");
        }
    
        return await this.authrepository.update(email, updatehostDto)
      }

      async findemail( email : string){
        return await this.authrepository.findOne({ where : { email } });
      }
      
}
