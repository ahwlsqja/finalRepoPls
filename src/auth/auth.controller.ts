import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';



@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService ) {}
      

  
  @Post("sign-up")
  @IsPublic()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }


  
  @Post("sign-in")
  @IsPublic()
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie("authorization", `Bearer ${user.access_token}`);
    res.send("로그인 완료");
  }
}
