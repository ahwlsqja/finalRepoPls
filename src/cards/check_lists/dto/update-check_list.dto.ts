import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckListDto } from './create-check_list.dto';

export class UpdateCheckListDto extends PartialType(CreateCheckListDto) {}
