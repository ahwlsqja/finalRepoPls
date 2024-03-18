
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Column, Entity } from "typeorm";

@Entity({
  name: "check_lists",
})
export class CheckList extends BaseModel {
  @Column({ type: "number", unique: true, nullable: false })
  cardId: number;

  @Column({ type: "varchar", nullable: false })
  title: string;

  @Column({ type: "date", nullable: false })
  createdAt: Date;

  @Column({ type: "date", nullable: false })
  updatedAt: Date;

  @Column({ type: "number", nullable: false })
  orderByCheck: number;
}
