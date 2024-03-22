import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { User } from "src/common/decorator/user.decorator";
import { Users } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

import { Roles } from "./decorators/roles.decorator";
import { Role } from "./types/userRole.type";
import { IsPublic } from "src/common/decorator/is-public.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Roles(Role.Admin)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }


  @Get("profile/:id")
  @IsPublic()
  async findOne(@Param("id") id: number) {
    return await this.usersService.findOne(id);
  }

  @Patch('profile')
  async update(@User() user : Users, 
  @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(user.id, updateUserDto);
  }

  @Patch("token")
  async tokenupdate(
    @Body() body ,
    @User() user: Users,
  ) {
    const email = body.email;
    const emailtoken = body.emailtoken;

    if(emailtoken !== user.emailtoken){
      throw new Error("인증 번호가 맞지 않습니다.");
    }
    
    return await this.usersService.tokenupdate(email);
  }

  @Delete('profile')
  async remove(@User() user : Users) {
    return await this.usersService.remove(user.id);
  }
}
