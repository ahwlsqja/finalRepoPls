import { OneToMany } from "typeorm";
import { BaseModel } from "src/common/entities/base.entity";
import { Comments } from "../comments/entities/comment.entity";
import { Column, Entity } from "typeorm";
import { Color } from "src/common/types/color.type";

@Entity({
  name: "cards",
})
export class Cards extends BaseModel {
  @Column({ type: "number", unique: true, nullable: false })
  columnId: number;

  @Column({ type: "varchar", nullable: false })
  title: string;

  @Column({ type: "enum", nullable: false, default: "BLACK" })
  color: Color;

  @Column({ type: "varchar", nullable: false })
  content: string;

  @Column({ type: "number", nullable: false })
  orderByCards: number;

  @Column({ type: "number", nullable: false })
  tag: number;

  @Column({ type: "date", nullable: false })
  endDate: Date;

  @OneToMany(() => Comments, (comment) => comment.card, {
    eager: true,
  })
  comments: Comments[];
}
