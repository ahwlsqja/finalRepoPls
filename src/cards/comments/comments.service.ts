import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "./entities/comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentsService {
}
