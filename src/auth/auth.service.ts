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
      const { email, password } = signInUserDto;

      const existUser = await this.prisma.user.findUnique({ where: { email } });

      if (!existUser) {
        return new HttpException('Invalid Email', HttpStatus.BAD_REQUEST);
      }

      const checkPassword = await bcrypt.compare(password, existUser.password);

      if (!checkPassword) {
        return new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      }

      if (existUser.status !== 'ACTIVE') {
        return new HttpException('User is not ACTIVE', HttpStatus.BAD_REQUEST);
      }

      const accessTime = this.configService.get<string>('jwt.access_time');
      const refreshTime = this.configService.get<string>('jwt.refresh_time');

      const accessToken = this.generateToken(
        {
          email: existUser.email,
          username: existUser.username,
          role: existUser.role,
        },
        { expiresIn: accessTime },
      );

      const refreshToken = this.generateToken(
        {
          email: existUser.email,
          username: existUser.username,
          role: existUser.role,
        },
        { expiresIn: refreshTime },
      );

      if (!accessToken || !refreshToken) {
        return new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const existRefresh = await this.prisma.refreshToken.findFirst({
        where: { userId: existUser.id },
      });

      if (existRefresh) {
        await this.prisma.refreshToken.update({
          where: { id: existRefresh.id },
          data: { token: refreshToken },
        });
      } else {
        await this.prisma.refreshToken.create({
          data: { userId: existUser.id, token: refreshToken },
        });
      }

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateToken(
    payload: { email: string; role: string; username: string },
    expires: { expiresIn: string },
  ) {
    return this.jwtService.sign(payload, expires);
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
