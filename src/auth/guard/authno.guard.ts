import { CanActivate, ExecutionContext, Injectable, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

@Injectable()
export class noAuthTokenGuard extends AuthGuard('jwt') implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        return true
    }
}
