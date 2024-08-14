import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTweetDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 286)
  content: string;
}
