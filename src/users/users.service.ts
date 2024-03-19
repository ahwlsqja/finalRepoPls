import { Injectable } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";


@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private userRepository : Repository<Users>){}
  

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where : { id }});
    if(!user){
      throw new Error("유저가 존재하지 않습니다.");
    }
    return user;
  }

  async update(id: number, password : string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where : { id }});
    console.log(id);
    console.log(user);


    if(user === null){
      throw new Error("유저가 존재하지 않습니다.");
    }

    if (!(await compare(password, user.password))) {
      throw new Error('비밀번호를 확인해주세요.');
    }

    return await this.userRepository.update(id, updateUserDto)
  }

  async remove(id: number, password : string) {
    const user = await this.userRepository.findOne({ where : { id }});
    
    if(user === null){
      throw new Error("유저가 존재하지 않습니다.");
    }
    
    if (!(await compare(password, user.password))) {
      throw new Error('비밀번호를 확인해주세요.');
    }

    return await this.userRepository.delete(id);
  }

}
