import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { Users } from "src/users/entities/user.entity";

export const User = createParamDecorator((data: keyof Users | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as Users
    
    if(!user){
        throw new InternalServerErrorException('Request에 user 프로터티가 존재하지 않습니다!');
    }

    if(data){
        return user[data]
    }
    
    return user;
});  