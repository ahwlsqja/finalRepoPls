import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { User } from "src/common/decorator/user.decorator";
import { Users } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { Roles } from "./decorators/roles.decorator";
import { Role } from "./types/userRole.type";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { NotificationsService } from "src/notification/notifications.service";
import { TokenDto } from "./dto/update-token.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("A1. Users")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly notificationsService : NotificationsService) {}


  @Roles(Role.Admin)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get("profile/:id")
  async findOne(@Param('id') id: number, @User() user : Users) {
    return await this.usersService.findOne(id, user);
  }


  @Patch('profile/:id')
  async update(@Param('id') id : number, @User() user : Users, 
  @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, user, updateUserDto);
  }


  @Patch("token")
  async tokenupdate(
    @Body() tokenDto : TokenDto,
    @User() user: Users,
  ) {
    return await this.usersService.tokenupdate(tokenDto.email, tokenDto.emailtoken, user);
  }


  @Delete('profile/:id')
  async remove(@Param('id') id : number, @User() user : Users) {
    return await this.usersService.remove(id, user);
  }
  

  @Get("alarm")
  async getNotifications(
    @User() user : Users,
  ) {
    // 레디스에서 알림데이터 조회
    const name = user.name;

    const notification = await this.notificationsService.getNotifications(name);
    return notification;
  }
}
