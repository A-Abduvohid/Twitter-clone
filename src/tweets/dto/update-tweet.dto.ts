import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateTweetDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 286)
  content: string;
}
