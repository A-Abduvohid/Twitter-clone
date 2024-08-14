import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  receiverId: string;
}
