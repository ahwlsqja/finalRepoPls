import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common'
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return await this.usersService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() body, updateUserDto: UpdateUserDto, @Req() req) {
    console.log(req.sub);
    console.log('---------');
    console.log(req.users);
    console.log(req.user);
    
    const password = body.password;
    const user = req.user; 
   

    if(user !== id){
      throw new Error("유저 아이디가 맞지 않습니다.");
    }

    return await this.usersService.update(id, password, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number, @Body() body, @Req() req) {
    const password = body.password;
    const user = req.users.id;

    if(user !== id){
      throw new Error("유저 아이디가 맞지 않습니다.");
    }

    return await this.usersService.remove(id, password);
  }

  

}
