
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CheckList } from "./checkList.entity";
import { CurrentStatus } from "../types/checkCurrent-status.type";

@Entity({
  name: "checkCurrent",
})
export class CheckCurrent extends BaseModel {
  
  @Column({ type: "varchar", nullable: false })
  content: string;

  @Column({ type: "enum", enum: CurrentStatus, nullable: false })
  status: CurrentStatus;

  @ManyToOne(() => CheckList, (checkList) => checkList.checkCurrents)
  @JoinColumn({ name: "checkListId", referencedColumnName: "id" })
  checkList: CheckList | null;

  @Column({ type: "bigint", nullable: true })
  checkListId: number;
}
