import { BoardMember } from "src/boards/entities/boardmember.entity";
import { Comments } from "src/cards/comments/entities/comment.entity";
import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({
  name: "users",
})
export class Users extends BaseModel {

  @Column({ type: "varchar", nullable: false })
  email: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({ type: "boolean", nullable: false })
  IsAdmin: boolean;

  @Column({ type: "int", nullable: false })
  emailtoken: number;

  @Column({ type: "boolean", default: false })
  IsVaildated: boolean;

  @Column({ type: "boolean", default: false })
  sshKey: boolean;

  @OneToMany(() => Comments, (comment) => comment.user, {
    eager: true,
  })
  comments: Comments[];

  @OneToMany(() => BoardMember, (boardmember) => boardmember.user, {
    onDelete: "CASCADE",
  })
  boardmember: BoardMember[];
}
