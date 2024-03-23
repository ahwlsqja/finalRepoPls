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
import { BoardMemberGuard } from "src/auth/guard/boardmember.guard";
import { User } from "src/common/decorator/user.decorator";


@UseGuards(AuthGuard('jwt'))
@Controller("/:boardId/:columnId/cards")

export class CardsController {
  constructor(
    private readonly cardsService: CardsService
    ) {}
  
  
  // 카드 상세 조회

  @UseGuards(BoardMemberGuard)
  @Get(":cardId")
  async findCard(
    @Param("boardId") boardId: number,
    @Param("columnId") columnId: number,
    @Param("cardId") id: number,
    ) {
    return this.cardsService.getCardsByColumnId(id);
  }

  // 카드 생성

  @UseGuards(BoardMemberGuard)
  @Post()
  async createCard(
    @Param("boardId") boardId: number,
    @Param('columnId') columnId: number,
    @User() user: Users,
    @Body() createCardDto: CreateCardDto,
  ) {
    const name = user.name
    const data = await this.cardsService.createCard(
      boardId,
      columnId,
      user.id,
      name,
      createCardDto
    );
    
    return{
      statusCode: HttpStatus.CREATED,
      message: "카드 생성에 성공하였습니다.",
      data,
    }
  }

  // 카드 수정 / 담당자 변경

  @UseGuards(BoardMemberGuard)
  @Patch(":columnId/:cardId")
  async updateCard(
    @Param("boardId") boardId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') id: number,
    @User() user: Users,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const name = user.name
    const data = await this.cardsService.updateCard(
      id,
      name,
      updateCardDto
    );

    return{
      statusCode: HttpStatus.OK,  //200
      message: "카드가 수정 되었습니다.",
      data,
    }
  }

  // 카드 삭제

  @UseGuards(BoardMemberGuard)
  @Delete(":columnId/:cardId")
  async deleteCard( 
    @Param("boardId") boardId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') id: number,
    @User() user: Users,
    ) {
    const name = user.name
    await this.cardsService.deleteCard(id, name);

    return{
      statusCode: HttpStatus.OK,  //200
      message: "카드가 삭제 되었습니다.",
    }
  }

  // 작업자 할당
  @UseGuards(BoardMemberGuard)
  @Patch(":columnId/:cardId/:userId")
  async assignWorker(
    @Param("boardId") boardId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') id:number,
    @Param('userId') userId: number,
    @User() user: Users,
  ){
    const name = user.name
    const data = await this.cardsService.assignWorker(
      id,
      boardId,
      name,
      userId,
    )

    return{
      statusCode: HttpStatus.OK,  //200
      message: "작업자 할당에 성공하였습니다.",
      data,
    }
  }

  // 작업자 삭제(해제)

  @UseGuards(BoardMemberGuard)
  @Patch(":columnId/:cardId/:userId")
  async changeWorker(
    @Param("boardId") boardId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') id:number,
    @Param('userId') userId: number,
    @User() user: Users,
  ){
    const name = user.name
    const data = await this.cardsService.changeWorker(
      id,
      boardId,
      name,
      userId,
    )

    return{
      statusCode: HttpStatus.OK,  //200
      message: "작업자 삭제에 성공하였습니다.",
      data,
    }
  }


  // 칼럼 내 위치 변경

  @UseGuards(BoardMemberGuard)
  @Patch(':cardId/:newOrder')
  async changeCardPosition(
    @Param('cardId') id: number,
    @Param('newOrder') newOrder: number,
  ) {
      const data = await this.cardsService.swapOrder(id, newOrder);
  
      return{
        statusCode: HttpStatus.OK,  //200
        message: "카드 위치 변경에 성공하였습니다.",
        data,
      }
  }
}


