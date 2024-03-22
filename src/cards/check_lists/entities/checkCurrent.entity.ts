
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CurrentStatus } from "../types/checkCurrent-status.type";
import { CheckLists } from "./checkList.entity";

@Entity({
  name: "checkCurrent",
})
export class CheckCurrent extends BaseModel {
  
  @Column({ type: "varchar", nullable: false })
  content: string;

  @Column({ type: "enum", enum: CurrentStatus, nullable: false })
  status: CurrentStatus;

  @ManyToOne(() => CheckLists, (checkList) => checkList.checkCurrents)
  @JoinColumn({ name: "checkListId", referencedColumnName: "id" })
  checkList: CheckLists | null;

  @Column({ type: "bigint", nullable: true })
  checkListId: number;
}
