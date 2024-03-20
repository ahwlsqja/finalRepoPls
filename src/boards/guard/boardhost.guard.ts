import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { BoardsService } from "../boards.service";

@Injectable()
export class BoardHostGuard implements CanActivate {
    constructor(private boardService: BoardsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const user = request.user; 
        const boardId = request.params.boardId;

        const member = await this.boardService.checkUserIsHostForGuard(user.id, boardId)
        return !!member
    }
}