import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { User } from "src/common/decorator/user.decorator";
import { Users } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { adminGuard } from "./guard/adminguard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@User() user : Users) {

    if(user.IsAdmin === false){
      throw new Error("권한이 존재하지 않습니다.");
    }

    return await this.usersService.findAll();
  }


  @Get("profile/:id")
  async findOne(@Param("id") id: number) {
    return await this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async update(@User() user : Users, 
  @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(user.id, updateUserDto);
  }


  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async remove(@User() user : Users) {
    return await this.usersService.remove(user.id);
  }

}
