import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { Guard } from './guard/guard';




@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService ) {}
      

  
  @Post("sign-up")
  @UseGuards(Guard)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  
  
  @Post("sign-in")
  @UseGuards(Guard)
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie("authorization", `Bearer ${user.access_token}`);
    res.send("로그인 완료");
  }

//   @Get("/login/google")	//restAPI만들기. 엔드포인트는 /login/google.
//   @UseGuards(AuthGuard("google"))	//인증과정을 거쳐야하기때문에 UseGuards를 써주고 passport인증으로 AuthGuard를 써준다. 이름은 google로
// 	async loginGoogle(
//     @Req() req: Request & IOAuthUser,
//     @Res() res: Response	//Nest.js가 express를 기반으로 하기때문에 Request는 express에서 import한다.
//   ) {
//      //프로필을 받아온 다음, 로그인 처리해야하는 곳(auth.service.ts에서 선언해준다)
//     this.authService.OAuthLogin({req, res});

// }
}
