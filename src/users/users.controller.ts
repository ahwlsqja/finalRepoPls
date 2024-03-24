import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, UseGuards } from "@nestjs/common";
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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("A1. Users")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly notificationsService : NotificationsService) {}

  @ApiOperation({ summary: "사용자 정보 목록 조회 API " })
  @ApiBearerAuth("access-token")
  @Roles(Role.Admin)
  @Get()
  async getAllUserInfos() {
    const data = await this.usersService.getAllUserInfos();
    return {
      statusCode: HttpStatus.OK,
      message: "사용자 정보 목록 조회에 성공하였습니다.",
      data
    }
  }

  @ApiOperation({ summary: "사용자 정보 상세 조회 API " })
  @ApiBearerAuth("access-token")
  @Get("profile/:id")
  async getUserInfosByUserId(@Param('id') id: number, @User() user : Users) {
    const data = await this.usersService.getUserInfosByUserId(id, user);
    return {
      statusCode: HttpStatus.OK,
      message: "사용자 정보 상세 조회에 성공하였습니다.",
      data
    }
  }

  @ApiOperation({ summary: "사용자 정보 수정 API " })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: UpdateUserDto })
  @Patch('profile/:id')
  async updateUserInfosByUserId(@Param('id') id : number, @User() user : Users, 
  @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.updateUserInfosByUserId(id, user, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: "사용자 정보 수정에 성공하였습니다.",
      data
    }
  }

  @ApiOperation({ summary: "이메일 인증 API " })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: TokenDto })
  @Patch("token")
  async tokenUpdate(
    @Body() tokenDto : TokenDto,
    @User() user: Users,
  ) {
    const data = await this.usersService.tokenUpdate(tokenDto.email, tokenDto.emailtoken, user);
    return {
      statusCode: HttpStatus.OK,
      message: "이메일 인증이 완료되었습니다."
    }
  }

  @ApiOperation({ summary: "사용자 정보 삭제 API " })
  @ApiBearerAuth("access-token")
  @Delete('profile/:id')
  async removeUserInfosByUserId(@Param('id') id : number, @User() user : Users) {
    const data = await this.usersService.removeUserInfosByUserId(id, user);
    return {
      statusCode: HttpStatus.OK,
      message: "사용자 정보 삭제에 성공하였습니다."
    }
  }
  
  @ApiOperation({ summary: "알림 데이터 조회 API " })
  @ApiBearerAuth("access-token")
  @Get("alarm")
  async getNotifications(
    @User() user : Users,
  ) {
    // 레디스에서 알림데이터 조회
    const name = user.name;

    const notification = await this.notificationsService.getNotifications(name);
    return {
      statusCode: HttpStatus.OK,
      message: "알림 데이터 조회에 성공하였습니다.",
      notification
    }
  }
}
