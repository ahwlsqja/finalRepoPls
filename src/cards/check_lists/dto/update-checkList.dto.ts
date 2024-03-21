import { PartialType } from "@nestjs/mapped-types";
import { CreateCheckListDto } from "./create-checkList.dto copy";


export class UpdateCheckListDto extends PartialType(CreateCheckListDto) {}
