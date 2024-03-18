
import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name : 'users'
})

export class Users extends BaseModel {

    @Column({ type : "varchar", nullable : false })
    email : string

    @Column({ type : 'varchar', nullable : false })
    password : string

    @Column({ type : 'boolean', nullable : false })
    IsAdmin : boolean

    @Column({ type : 'int', nullable : false })
    emailtoken : number

    @Column({ type : 'boolean', default : false })
    IsVaildated : boolean

    @Column({ type : 'boolean', default : false })
    sshKey : boolean

}
