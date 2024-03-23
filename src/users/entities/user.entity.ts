import { BoardMember } from "src/boards/entities/boardmember.entity";
import { Comments } from "src/cards/comments/entities/comment.entity";
import { BaseModel } from "src/common/entities/basemodel.entitiy";

import { Column, Entity, OneToMany } from "typeorm";
import { Role } from "../types/userRole.type";

@Entity({
  name: "users",
})
export class Users extends BaseModel {
  @Column("varchar", { name: "email", nullable: false })
  email: string;

  @Column("varchar", { name: "password", nullable: false })
  password: string;

  // @Column({ type: 'enum', enum: Role, default: Role.User })
  // role: Role;
  @Column({
    enum: Object.values(Role),
    default: Role.User,
  })
  role: Role;
  @Column('varchar', { name: "emailtoken", nullable: true })
  emailtoken: string;

  @Column("boolean", { name: "IsVaildated", default: false })
  IsVaildated: boolean;

  @Column('varchar', { name: "sshKey", nullable : true })
  sshKey: string;

  @Column('varchar', { name: 'name', nullable: false})
  name: string

  @OneToMany(() => Comments, (comment) => comment.user, {
    eager: true,
  })
  comments: Comments[];

  @OneToMany(() => BoardMember, (boardmember) => boardmember.user, {
    onDelete: "CASCADE",
  })
  boardmember: BoardMember[];
}


