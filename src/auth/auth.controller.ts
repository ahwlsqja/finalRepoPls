import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';



@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService ) {}
      
  
  @Post("sign-up")
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @Post("sign-in")
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie("authorization", `Bearer ${user.access_token}`);
    res.send({
      statusCode: HttpStatus.OK,
      message: "로그인에 성공하였습니다.",
      user
    });

  }
}
