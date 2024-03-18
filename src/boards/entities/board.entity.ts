import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { BaseModel } from "src/common/entities/basemodel.entitiy";
import { Color } from "src/common/types/color.type";
import { Column, Entity, OneToMany } from "typeorm";
import { BoardMember } from "./boardmember.entity";

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

  // 설명
  @Column("varchar", { name: "description", nullable: false })
  @IsString()
  description: string;

  // @OneToMany(() => BoardMember, (boardMember) => boardMember.board)
  // boardMember: BoardMember[];
}
