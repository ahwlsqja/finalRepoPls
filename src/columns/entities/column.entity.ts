// ./src/boards/entities/column.entity

import { IsString } from "class-validator";
import { Board } from "src/boards/entities/board.entity";
import { Cards } from "src/cards/entities/card.entity";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Color } from "src/common/types/color.type";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity("columns")
export class Columns extends BaseModel {
  @IsString()
  @Column('int',{ name: 'boardId' , nullable: true })
  boardId: number;


  @Column('varchar',{ name: 'title' , nullable: false})
  title: string;


  @Column("enum", {
    name: "color",
    enum: Object.values(Color),
    default: Color.BLACK,
    nullable: false,
  })
  color: Color;


  @Column('int', { name: "orderByColumns", nullable: false, default: 1 })
  orderByColumns: number;

  @ManyToOne(() => Board, (board) => board.column, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "boardId", referencedColumnName: "id" })
  board: Board;

  @OneToMany(() => Cards, (card) => card.column)
  cards: Cards[];
}
