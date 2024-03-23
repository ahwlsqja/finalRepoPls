
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CheckCurrent } from "./checkCurrent.entity";
import { Cards } from "src/cards/entities/card.entity";

@Entity({
  name: "checkList",
})
export class CheckLists extends BaseModel {

  @Column({ type: "varchar", nullable: false })
  title: string;

  @Column({ type: "date", nullable: false })
  createdAt: Date;

  @Column({ type: "date", nullable: false })
  updatedAt: Date;

  @Column({ type: "int", nullable: false, default: 1 })
  orderByCheck: number;

  @OneToMany(() => CheckCurrent, (checkCurrent) => checkCurrent.checkList, {
    eager: true
  })
  checkCurrents: CheckCurrent[];

@ManyToOne(() => Cards, (card) => card.checkLists, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cardId", referencedColumnName: "id" })
  card: Cards | null;

  @Column({ type: "bigint", nullable: true })
  cardId: number;
}
