import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/users/decorators/roles.decorator';



@Injectable()
export class RolesGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector,
    ){

    }
    async canActivate(context: ExecutionContext): Promise<boolean>{
        /**
         *  Roles annotation에 대한 metadata를 가져와야 한다.
         * 
         * Reflector
         * getAll 
         * 매서드에 등록되어있는 에노테이션을 가져온다/
         */
        const requiredRole = this.reflector.getAllAndOverride(
            ROLES_KEY, // 이 키값을 기준으로 메타데이터를 가져올거다.
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        if(!requiredRole){ // Role을 등록하지 않았다..
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if(!user){
            throw new UnauthorizedException(
                '토큰을 제공해주세요.'
            );
        }

        if(user.role !== requiredRole){
            throw new ForbiddenException(
                `이 작업을 수행할 권한이 없습니다. ${requiredRole}이 필요합니다.`
            );
        }

        return true;
    }
}
