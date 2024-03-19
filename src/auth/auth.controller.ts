import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdatehostDto } from 'src/users/dto/update-token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sing-up')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @Patch("token")
  async tokenupdate( @Body() body, updatehostDto : UpdatehostDto) {
    const email = body.email;
    return await this.authService.tokenupdate(email, updatehostDto);
  }

  @Post('login')
  async login( @Body() body ){
    const email = body.email;
    const password = body.password;
    
    
    return await this.authService.login(email, password);
  }
  
}
