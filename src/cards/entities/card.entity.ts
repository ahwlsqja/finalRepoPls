import { OneToMany } from "typeorm";
import { Comments } from "../comments/entities/comment.entity";

export class Cards {


    @OneToMany(() => Comments, (comment) => comment.card, {
        eager: true,
      })
      comments: Comments[];
}
