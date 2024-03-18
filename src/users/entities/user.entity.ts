import { BoardMember } from "src/boards/entities/boardmember.entity";
import { Comments } from "src/cards/comments/entities/comment.entity";
import { BaseModel } from "src/common/entities/basemodel.entitiy";

import { Column, Entity, OneToMany } from "typeorm";

@Entity({
  name: "users",
})
export class Users extends BaseModel {

  @Column('varchar',{ name: "email", nullable: false })
  email: string;

  @Column('varchar',{ name: "password", nullable: false })
  password: string;

  @Column('boolean', { name: "IsAdmin",  default: false })
  IsAdmin: boolean;

  @Column('varchar', { name: "emailtoken", nullable: false })
  emailtoken: string;

  @Column('boolean', { name: "IsVaildated", default: false })
  IsVaildated: boolean;

  @Column('boolean', { name: "sshKey", default: false })
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
