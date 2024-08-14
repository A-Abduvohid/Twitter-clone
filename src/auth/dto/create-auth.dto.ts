import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 22)
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 12)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 36)
  full_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(2, 120)
  bio: string;
}

export class SignInUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 12)
  password: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  otp: number;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
