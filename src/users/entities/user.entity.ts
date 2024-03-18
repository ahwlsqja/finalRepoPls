import { Comments } from "src/cards/comments/entities/comment.entity";
import { BaseModel } from "src/common/entities/base.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name : 'users'
})

export class Users extends BaseModel {
    @Column({ type : "varchar" })
    email : string

    @Column({ type : 'varchar' })
    password : string

    @Column({ type : 'boolean'})
    IsAdmin : boolean

    @Column({ type : 'int' })
    emailtoken : number

    @Column({ type : 'boolean' })
    IsVaildated : boolean

    @Column({ type : 'boolean' })
    sshKey : boolean

    @OneToMany(() => Comments, (comment) => comment.user, {
        eager: true,
      })
      comments: Comments[];
}
