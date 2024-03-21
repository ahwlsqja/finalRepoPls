import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';




@Injectable()
export class adminGuard extends AuthGuard('jwt') implements CanActivate {
  constructor() {
    super()
  }
  

  async canActivate(context: ExecutionContext) : Promise<boolean> {
    await super.canActivate(context);
    const { user } = context.switchToHttp().getRequest();
    
    if(!user || user.IsAdmin === false){
      throw new UnauthorizedException("어드민이 아닙니다.");
    }

    return true;
    
    }
}