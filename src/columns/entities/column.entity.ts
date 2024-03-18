import { IsString } from "class-validator";
import { Board } from "src/boards/entities/board.entity";
import { Cards } from "src/cards/entities/card.entity";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Color } from "src/common/types/color.type";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity('columns')
export class Columns extends BaseModel {

    @IsString()
    @Column({ unsigned: true })
    boardId: number;

    @Column()
    title: string;

    @Column("enum", {
        name: "color",
        enum: Object.values(Color),
        default: Color.BLACK,
        nullable: false,
      })
    color: Color;

    @Column({ type: 'bigint', nullable: false })
    orderByColumns: number;

    @ManyToOne(() => Board, (board) => board.column, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'boardId', referencedColumnName: 'id'})
    board: Board


    @OneToMany(() => Cards, (card) => card.column)
    cards: Cards[];
}