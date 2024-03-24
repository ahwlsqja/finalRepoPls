import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cards } from "./card.entity";
import { BoardMember } from "src/boards/entities/boardmember.entity";

@Entity({
  name: "cardworkers",
})
export class CardWorkers {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Cards, (card) => card.cardworkers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cardId", referencedColumnName: "id" })
  cards: Cards | null;

  @ManyToOne(() => BoardMember, (boardmember) => boardmember.cardworker, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "boardmemberId", referencedColumnName: "id" })
  boardmember: BoardMember | null;

  @Column({ type: "int", nullable: false })
  boardmemberId: number;
}
