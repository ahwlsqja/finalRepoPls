import { IsBoolean } from "class-validator";

export class UpdatehostDto {
    
    @IsBoolean()
    IsVaildated : boolean

}
