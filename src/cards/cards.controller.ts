import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from "@nestjs/common"
import { CardsService } from "./cards.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { AuthGuard } from "@nestjs/passport";
import { Users } from "src/users/entities/user.entity";    
import { AssignDto } from "./dto/assign-card.dto";
import { ChangeDto } from "./dto/change-card.dto";
@UseGuards(AuthGuard('jwt'))
@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  
  // 카드 상세 조회
  @Get(":columnId/:id")
  async findCard(@Param("id") id: number) {
    return this.cardsService.getCardsByColumnId(id);
  }

  // 카드 생성
  @Post(':columnId')
  async createCard(
    @Param('columnId') columnId: number,
    @Body() CreateCardDto: CreateCardDto,
  ) {
    const data = await this.cardsService.createCard(
      Users.id,
      CreateCardDto.content,
    );
    
    return{
      statusCode: HttpStatus.OK,  //200
      message: "카드 생성에 성공하였습니다.",
      data,
    }
  }

  // 카드 수정 / 담당자 변경
  @Patch(":columnId/:id")
  async updateCard(
    @Param('id') id: number,
    @Body() UpdateCardDto: UpdateCardDto,
  ) {
    const data = await this.cardsService.updateCard(
      id,
      UpdateCardDto.title,
      UpdateCardDto.content,
    );

    return{
      statusCode: HttpStatus.OK,  //200
      message: "카드가 수정 되었습니다.",
      data,
    }
  }

  // 카드 삭제
  @Delete(":columnId/:id")
  async deleteCard( 
    @Param('id') id: number) {
    await this.cardsService.deleteCard(id, Users.id);

    return{
      statusCode: HttpStatus.OK,  //200
      message: "카드가 삭제 되었습니다.",
    }
  }

  // 작업자 할당
  @Patch(":columnId/:id")
  async assignWorker(
    @Param('id') id:number,
    @Body () AssignDto : AssignDto,
  ){
    const data = await this.cardsService.assignWorker(
      id,
      AssignDto.tag
    )

    return{
      statusCode: HttpStatus.OK,  //200
      message: "작업자 할당에 성공하였습니다.",
      data,
    }
  }

  // 작업자 변경
  @Patch(":columnId/:id")
  async changeWorker(
    @Param('id') id:number,
    @Body () changeDto : ChangeDto,
  ){
    const data = await this.cardsService.changeWorker(
      id,
      changeDto.tag
    )

    return{
      statusCode: HttpStatus.OK,  //200
      message: "작업자 변경에 성공하였습니다.",
      data,
    }
  }


  // 칼럼 내 위치 변경
  @Patch(':id/:newOrderByCards')
  async changeCardPosition(
    @Param('id') id: number,
    @Param('newOrderByCards') newOrderByCards: number,
  ) {
      const data = await this.cardsService.changeOrderByCard(id, newOrderByCards);
  
      return{
        statusCode: HttpStatus.OK,  //200
        message: "카드 위치 변경에 성공하였습니다.",
        data,
      }
  }
}

function UserInfo(): (target: CardsController, propertyKey: "createCard", parameterIndex: 0) => void {
  throw new Error("Function not implemented.");
}

