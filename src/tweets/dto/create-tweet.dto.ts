import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTweetDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 286)
    content: string
}
