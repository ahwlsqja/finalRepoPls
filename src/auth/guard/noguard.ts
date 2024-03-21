import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Guard } from './guard';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class NoAuthTokenGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(
        private guard : Guard ) {
            super()
        }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        return true; // JWT 인증을 피하기 위해 항상 true 반환
    }
}
