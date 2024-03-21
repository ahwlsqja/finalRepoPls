import { Injectable } from "@nestjs/common"
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) 
              private userRepository : Repository<Users>){}
  

  async findAll() {
    return await this.userRepository.find({ select : ['id', 'email', 'password', 'name', 'IsAdmin', 'IsVaildated', 'sshKey', 'createdAt', 'updatedAt'] });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where : { id },
    select: ['id', 'email', 'name', 'IsVaildated', 'createdAt', 'updatedAt']});
    if(!user){
      throw new Error("유저가 존재하지 않습니다.");
    }
    return user;
  }

  async update(userId : number, updateUserDto: UpdateUserDto) {

    if(!userId){
      throw new Error("유저가 존재하지 않습니다.");
    }

    return await this.userRepository.update(userId, updateUserDto);
  }

  async tokenupdate(email : string) {
    const user = await this.userRepository.findOne({ where : { email }});

    if(!user){
      throw new Error("유저가 존재하지 않습니다.");
    }

    if(user.IsVaildated === true){
      throw new Error("이미 호스트 인증을 받으셨습니다.");
    }

    user.IsVaildated = true
    return await this.userRepository.save(user);
  }

  async remove(userId : number) {
    return await this.userRepository.delete(userId);
  }

  async findid (id : number) {
    return await this.userRepository.findOne({ where : { id } });
  }

  async findemail(email : string){
    return await this.userRepository.findOne({ where : { email } });
  }

}
