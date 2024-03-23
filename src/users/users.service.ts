import { BadRequestException, ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) 
              private userRepository : Repository<Users>){}
  

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number, user : Users) {
    const users = await this.userRepository.findOne({ where : { id },
    select: ['id', 'email', 'name', 'IsVaildated', 'createdAt', 'updatedAt', 'role']});

    if(!users){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(user.role === 1){
      return users;
    } else if(!users){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(users.role !== user.role){
      throw new ForbiddenException("접근할 수 없는 유저입니다.");
    }

    if(id !== user.id){
      throw new UnauthorizedException("정보가 일치하지 않습니다.");
    }

    if(users.IsVaildated === false){
      throw new ForbiddenException("이메일 인증을 거쳐야 하는 회원입니다.");
    }

    return users;
  }
  

  async update(userId : number, user : Users, updateUserDto: UpdateUserDto) {
    const users = await this.findid(userId);

    if(!users){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(user.role === 1){
      return await this.userRepository.update(userId, updateUserDto);
    } else if(!users){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(users.role !== user.role){
      throw new ForbiddenException("접근할 수 없는 유저입니다.");
    }

    if(userId !== user.id){
      throw new UnauthorizedException("정보가 일치하지 않습니다.");
    }
    
    if(users.IsVaildated === false){
      throw new ForbiddenException("이메일 인증을 거쳐야 하는 회원입니다.");
    }
  
    return await this.userRepository.update(userId, updateUserDto);
  }

  async tokenupdate(email : string, emailtoken : string, user : Users) {
    const users = await this.userRepository.findOne({ where : { email }});

    if(!users){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(users.IsVaildated === true){
      throw new BadRequestException("이미 호스트 인증을 받으셨습니다.");
    }

    if(emailtoken !== user.emailtoken){
      throw new MethodNotAllowedException("인증 번호가 맞지 않습니다.");
    }

    user.IsVaildated = true
    return await this.userRepository.save(user);
  }

  async remove(userId : number, user : Users) {
    const users = await this.findid(userId);

    if(!users){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(user.role === 1){
      return await this.userRepository.delete(userId);
    } else if(!users){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(users.role !== user.role){
      throw new ForbiddenException("접근할 수 없는 유저입니다.");
    }

    if(userId !== user.id){
      throw new UnauthorizedException("정보가 일치하지 않습니다.");
    }

    if(users.IsVaildated === false){
      throw new ForbiddenException("이메일 인증을 거쳐야 하는 회원입니다.");
    }

    return await this.userRepository.delete(userId);
  }

  async findid (id : number) {
    return await this.userRepository.findOne({ where : { id } });
  }

  async findemail(email : string){
    return await this.userRepository.findOne({ where : { email } });
  }
}