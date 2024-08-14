import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFollowerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  followingId: string;
}
