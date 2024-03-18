import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cards } from "./card.entity";
import { BoardMember } from "src/boards/entities/boardmember.entity";

@Entity({
    name: 'cardworkers'
})
export class CardWorker {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cards, (cards) => cards.cardworker, {
        onDelete: "CASCADE",
      })
    @JoinColumn({ name: "cardId", referencedColumnName: "id" })
    cards: Cards;

    @ManyToOne(() => BoardMember, (boardmember) => boardmember.cardworker, {
        onDelete: "CASCADE",
      })
    @JoinColumn({ name: "boardmemberId", referencedColumnName: "id" })
    boardmember: BoardMember;
}