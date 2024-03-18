import { Cards } from "src/cards/entities/card.entity";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Users } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('comments')
export class Comments extends BaseModel {
  @Column({ type: "varchar", nullable: false })
  content: string;

  @ManyToOne(() => Users, (user) => user.comments)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: Users | null;

  @Column({ type: "bigint", nullable: true })
  userId: number;

  @ManyToOne(() => Cards, (card) => card.comments)
  @JoinColumn({ name: "cardId", referencedColumnName: "id" })
  card: Cards | null;

  @Column({ type: "bigint", nullable: true })
  cardId: number;
}
