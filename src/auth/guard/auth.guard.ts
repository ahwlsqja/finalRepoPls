import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "src/common/decorator/is-public.decorator";

@Injectable()
export class AuthTokenGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }
    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [
            context.getHandler(),
            context.getClass()
          ]
        );
    
        const req = context.switchToHttp().getRequest();
        if(isPublic){
          req.isRoutePublic = true;
    
          return true;
        }
        return super.canActivate(context) as Promise<boolean>
}
}