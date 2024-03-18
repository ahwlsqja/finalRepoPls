import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Color } from "src/common/types/color.type";
import { CardWorker } from "./cardworker.entity";
import { Comments } from "../comments/entities/comment.entity";


@Entity({
    name: 'cards',
  })
  export class Cards extends BaseModel{
  
    @Column({ type: 'number', unique: true, nullable: false })
    columnId: number;
  
    @Column({ type: 'varchar', nullable: false })
    title: string;
  
    @Column({ type: 'enum', nullable: false, default: "BLACK" })
    color: Color; //진영님꺼 가져오기

    @Column({ type: 'varchar', nullable: false })
    content: string;

    @Column({ type: 'number', nullable: false })
    orderByCards: number;

    @Column({ type: 'number', nullable: false })
    tag: number;

    @Column({ type: 'date', nullable: false })
    endDate: Date;

    @OneToMany(() => Comments, (comment) => comment.user, {
        eager: true,
      })
      comments: Comments[];

  }

  @Entity({
    name: 'check_lists',
  })

  comments: Comments[];

  @OneToMany(() => CardWorker, (cardworker) => cardworker.cards, {
    eager: true,
  })
  cardworker: CardWorker[];
}

  export class Check_lists extends BaseModel{

  
    @Column({ type: 'number', unique: true, nullable: false })
    cardId: number;
  
    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'number', nullable: false })
    orderByCheck: number;
  }

  @Entity({
    name: 'check_current',
  })
  export class Check_current extends BaseModel{
  
    @Column({ type: 'number', unique: true, nullable: false })
    checkId: number;
  
    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'boolean', nullable: false })
    isDone: boolean;
  }

