
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Color } from "src/common/types/color.type";
import { CardWorker } from "./cardworker.entity";
import { Comments } from "../comments/entities/comment.entity";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Columns } from "src/columns/entities/column.entity";


@Entity({
    name: 'cards',
  })
  export class Cards extends BaseModel{
  
    @Column({ type: 'bigint', unique: true, nullable: false })
    columnId: number;
  
    @Column({ type: 'varchar', nullable: false })
    title: string;
  
    @Column("enum", {
      name: "color",
      enum: Object.values(Color),
      default: Color.BLACK,
      nullable: false,
    })
    color: Color; //진영님꺼 가져오기

    @Column({ type: 'varchar', nullable: false })
    content: string;

    @Column({ type: 'bigint', nullable: false })
    orderByCards: number;

    @Column({ type: 'bigint', nullable: false })
    tag: number;

    @Column({ type: 'date', nullable: false })
    endDate: Date;

    @OneToMany(() => Comments, (comment) => comment.card, {
        eager: true,
      })
      comments: Comments[];

    @OneToMany(() => CardWorker, (cardworker) => cardworker.cards, {
      eager: true,
    })
    cardworker: CardWorker[];

    @ManyToOne(() => Columns, (column) => column.cards, {
      nullable: false,
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'columnId', referencedColumnName: 'id'})
    column: Columns
  }


