import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";


@Entity({
    name: 'cards'
})
export class Card extends BaseModel {

    @Column({ type: 'number', unique: true, nullable: false })
    columnId: number;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'enum', nullable: false, default: "BLACK" })
    color: color;
    
    @Column({ type: 'varchar', nullable: false })
    content: string;

    @Column({ type: 'number', nullable: false })
    orderByCards: number;

    @Column({ type: 'number', nullable: false })
    tag: number;

    @Column({ type: 'date', nullable: false })
    endDate: Date;

  }
  enum color {
    BLACK="BLACK",
    RED="RED",
    BLUE="BLUE",
    YELLOW="YELLOW",
    GREEN="GREEN",
}
