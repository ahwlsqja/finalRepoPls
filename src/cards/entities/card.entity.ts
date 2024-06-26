import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Color } from "src/common/types/color.type";
import { CardWorkers } from "./cardworker.entity";
import { Comments } from "../comments/entities/comment.entity";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Columns } from "src/columns/entities/column.entity";
import { CheckLists } from "../check_lists/entities/checkList.entity";
import { Tag } from "../types/tag.type";
@Entity({
  name: "cards",
})
  export class Cards extends BaseModel{

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column("enum", {
      name: "color",
      enum: Object.values(Color),
      default: Color.BLACK,
      nullable: false,
    })
    color: Color;

    @Column({ type: 'varchar', nullable: false })
    content: string;

    @Column({ type: 'int', nullable: false, default: 1 })
    orderByCards: number;

    @Column("enum", {
      name: "tag",
      enum: Object.values(Tag),
      default: Tag.Dev,
      nullable: false,
    })
    tag: Tag;

    @Column({ type: 'date', nullable: false })
    endDate: Date;

    @OneToMany(() => Comments, (comment) => comment.card, {
        eager: true,
      })
      comments: Comments[];

    @OneToMany(() => CardWorkers, (cardworker) => cardworker.cards, {
      eager: true,
    })
    cardworkers: CardWorkers[];

    @OneToMany(() => CheckLists, (checkList) => checkList.card, {
      eager: true,
    })
    checkLists: CheckLists[];

    @ManyToOne(() => Columns, (column) => column.cards, {
      nullable: false,
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "columnId", referencedColumnName: "id" })
    column: Columns;

    @Column({ type: 'int', nullable: true })
    columnId: number;
  }