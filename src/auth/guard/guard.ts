import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { NoAuthTokenGuard } from "./noguard";


@Injectable()
export class Guard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector,
    private noAuthTokenGuard : NoAuthTokenGuard ) {
    super();
  }
  

  async canActivate(context: ExecutionContext) {
    const authgurd = await super.canActivate(context);
    
    if (!authgurd) {
      await this.noAuthTokenGuard.canActivate(context);
      return false;
    }
      return true;
  }
}