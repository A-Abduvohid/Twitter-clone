import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 280)
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  tweetId: string;
}
