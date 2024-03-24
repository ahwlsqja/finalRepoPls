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
import { BoardMemberGuard } from "src/auth/guard/boardmember.guard";
import { User } from "src/common/decorator/user.decorator";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";


@ApiTags("C. Cards")
@UseGuards(AuthGuard('jwt'))
@Controller("/boards/:boardId/columns/:columnId/cards")

export class CardsController {
  constructor(
    private readonly cardsService: CardsService
    ) {}
  
  
  // 카드 상세 조회
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "컬럼 내 카드 조회 API" })
  @ApiBearerAuth("access-token")
  @Get(":cardId")
  async findCard(
    @Param("boardId") boardId: number,
    @Param("columnId") columnId: number,
    @Param("cardId") id: number,
    ) {
    const data = await this.cardsService.getCardsByColumnId(id);
    return {
      statusCode: HttpStatus.OK,
      message: "카드 조회에 성공하였습니다.",
      data
    }
  }

  // 카드 생성
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "컬럼 내 카드 등록 API" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreateCardDto })
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

  // 카드 수정
  @UseGuards(BoardMemberGuard)
  @Patch(":cardId")
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
  @Delete(":cardId")
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

  // 담당자 지정
  @ApiTags("Cards 담당자 지정")
  @UseGuards(BoardMemberGuard)
  @Patch(":cardId/:userId")
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
      message: "담당자 지정에 성공하였습니다.",
      data,
    }
  }

  // 담당자 지정 해제
  @ApiTags("Cards 담당자 지정 해제")
  @UseGuards(BoardMemberGuard)
  @Patch(":cardId/:userId")
  async changeWorker(
    @Param("boardId") boardId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') id:number,
    @Param('userId') userId: number,
    @User() user: Users,
  ){
    const name = user.name
    await this.cardsService.cancelAssignWorker(
      id,
      boardId,
      name,
      userId,
    )

    return{
      statusCode: HttpStatus.OK,  //200
      message: "담당자 지정 해제에 성공하였습니다.",
    }
  }


  // 컬럼 내 카드 위치 변경
  @ApiTags("Cards 위치 변경")
  @UseGuards(BoardMemberGuard)
  @ApiOperation({ summary: "컬럼 내 카드 위치 변경 API " })
  @ApiBearerAuth("access-token")
  @Patch(':cardId/swapOrder/:newOrder')
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