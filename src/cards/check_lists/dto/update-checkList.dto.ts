import { PartialType } from "@nestjs/mapped-types";
import { CreateCheckListDto } from "./create-checkList.dto";


export class UpdateCheckListDto extends PartialType(CreateCheckListDto) {}
