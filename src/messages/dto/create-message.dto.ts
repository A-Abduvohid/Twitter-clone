import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  receiverId: string;
}
