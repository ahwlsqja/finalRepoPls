import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({
    name: 'check_current',
  })
  export class Check_current extends BaseModel {

    @Column({ type: 'number', unique: true, nullable: false })
    checkId: number;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'boolean', nullable: false })
    isDone: boolean;
    
  }