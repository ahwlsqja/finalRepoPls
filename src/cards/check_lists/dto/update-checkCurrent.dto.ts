import { PartialType } from "@nestjs/mapped-types";
import { CreateCheckCurrentDto } from "./create-checkCurrent.dto";


export class UpdateCheckCurrentDto extends PartialType(CreateCheckCurrentDto) {}
