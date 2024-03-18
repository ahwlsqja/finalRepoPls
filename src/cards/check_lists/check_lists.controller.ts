import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common"
import { CheckListsService } from "./check_lists.service";
import { CreateCheckListDto } from "./dto/create-check_list.dto";
import { UpdateCheckListDto } from "./dto/update-check_list.dto";

@Controller("check-lists")
export class CheckListsController {
  constructor(private readonly checkListsService: CheckListsService) {}

  @Post()
  create(@Body() createCheckListDto: CreateCheckListDto) {
    return this.checkListsService.create(createCheckListDto);
  }

  @Get()
  findAll() {
    return this.checkListsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.checkListsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCheckListDto: UpdateCheckListDto,
  ) {
    return this.checkListsService.update(+id, updateCheckListDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.checkListsService.remove(+id);
  }
}
