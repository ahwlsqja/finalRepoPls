// cmhproject\src\boards\entities\board.entity.ts

import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Color } from "src/common/types/color.type";
import { Column, Entity, OneToMany } from "typeorm";
import { BoardMember } from "./boardmember.entity";
import { Columns } from "src/columns/entities/column.entity";

@Entity({
  name: "boards",
})
export class Board extends BaseModel {
  // 색
  @Column("enum", {
    name: "color",
    enum: Object.values(Color),
    default: Color.BLACK,
    nullable: false,
  })
  @IsEnum(Color)
  @IsNotEmpty({ message: "색을 입력해주세요" })
  color: Color;

  @Column("varchar", { name: 'title', nullable: false})
  title: string
  // 설명
  @Column("varchar", { name: "description", nullable: false })
  @IsString()
  description: string;

  @Column('boolean', { name: "isDeleted", nullable: false, default: false})
  isDeleted: boolean;

  @Column('timestamp', { name: 'deletedAt', nullable: true})
  deletedAt? : Date;

  @OneToMany(() => BoardMember, (boardmember) => boardmember.board)
  boardmember: BoardMember[];

  @OneToMany(() => Columns, (column) => column.board)
  column: Columns[];
}
