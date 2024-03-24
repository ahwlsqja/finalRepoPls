import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Color } from "src/common/types/color.type";
import { Tag } from "../types/tag.type";
import { CurrentStatus } from "../check_lists/types/checkCurrent-status.type";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {

    @ApiProperty({
      example: "서버 배포 업무",
      description: "카드 제목",
    })

    @IsString()
    @IsNotEmpty({ message: '카드 제목을 입력해주세요.' })
    title: string;

    @ApiProperty({
      example: "BLUE",
      description: "카드 색상",
    })

    @IsString()
    @IsNotEmpty({ message: '카드 색상을 입력해주세요.' })
    color: Color;

    @ApiProperty({
      example: "AWS EC2 배포하기",
      description: "카드 내용",
    })

    @IsString()
    @IsNotEmpty({ message: '카드 내용을 입력해주세요.' })
    content: string;
    
    @ApiProperty({
      example: "Dev",
      description: "카드 담당 부서 Tag",
    })

    @IsEnum(Tag, { message: '유효하지 않은 부서 입니다. 다시 입력해주세요'})
    @IsNotEmpty({ message: '부서를 입력해주세요.' })
    tag?: Tag;

    @ApiProperty({
      example: "2024-03-31",
      description: "카드 마감일",
    })

    @IsNotEmpty({ message: '카드의 마감일을 입력해주세요.' })
    endDate: Date;

  }