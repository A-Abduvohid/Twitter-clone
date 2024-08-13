import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  async sign_up(createUserDto: CreateUserDto) {
    try {
      const { email, username, password } = createUserDto;

      const existEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existEmail) {
        return new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const existUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existUsername) {
        return new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const salt = this.configService.get<number>('bcrypt_salt');

      const hashedPassword = await bcrypt.hash(password, salt);

      const otp = Math.floor(100000 + Math.random() * 900000);

      await this.mailerService.sendMail({
        to: email,
        subject: `Your One Time Password for Twitter-clone project`,
        html: `<h2>${otp}<h2>`,
      });

      const newUser = await this.prisma.user.create({
        data: { email, username, password: hashedPassword, ...createUserDto },
      });

      await this.prisma.otp.create({ data: { otp, userId: newUser.id } });

      return {
        message: 'User created successfully',
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sign_in(signInUserDto: SignInUserDto) {
    try {
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refresh_token(token: string) {
    try {
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMe() {
    try {
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout() {
    try {
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
