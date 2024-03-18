import { Injectable } from "@nestjs/common";
import { CreateCheckListDto } from "./dto/create-check_list.dto";
import { UpdateCheckListDto } from "./dto/update-check_list.dto";

@Injectable()
export class CheckListsService {
  create(createCheckListDto: CreateCheckListDto) {
    return "This action adds a new checkList";
  }

  findAll() {
    return `This action returns all checkLists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkList`;
  }

  update(id: number, updateCheckListDto: UpdateCheckListDto) {
    return `This action updates a #${id} checkList`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkList`;
  }
}
