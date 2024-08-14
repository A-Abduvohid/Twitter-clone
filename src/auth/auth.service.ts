import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  SignInUserDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}
  async sign_up(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
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
          id: existUser.id,
          email: existUser.email,
          username: existUser.username,
          role: existUser.role,
        },
        { expiresIn: accessTime },
      );

      const refreshToken = this.generateToken(
        {
          id: existUser.id,
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
    payload: { email: string; role: string; username: string; id: string },
    expires: { expiresIn: string },
  ) {
    return this.jwtService.sign(payload, { expiresIn: expires.expiresIn });
  }

  async verify_otp(verifyOtpDto: VerifyOtpDto) {
    try {
      const { userId, otp } = verifyOtpDto;

      const existOtp = await this.prisma.otp.findFirst({ where: { userId } });

      if (!existOtp) {
        return new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
      }

      if (otp !== existOtp.otp) {
        return new HttpException(
          'Your One Time Password is not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          status: 'ACTIVE',
        },
      });

      await this.prisma.otp.delete({ where: { id: existOtp.id } });

      return {
        message: 'Your One Time Password is match',
        sattusCode: 200,
      };
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
      const existRefresh = await this.prisma.refreshToken.findFirst({
        where: { token },
      });

      if (!existRefresh) {
        return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }

      const decodedUser = this.jwtService.verify(existRefresh.token);

      const accessTime = this.configService.get<string>('jwt.access_time');
      const refreshTime = this.configService.get<string>('jwt.refresh_time');

      const accessToken = this.generateToken(
        {
          id: decodedUser.id,
          email: decodedUser.email,
          username: decodedUser.username,
          role: decodedUser.role,
        },
        { expiresIn: accessTime },
      );

      const refreshToken = this.generateToken(
        {
          id: decodedUser.id,
          email: decodedUser.email,
          username: decodedUser.username,
          role: decodedUser.role,
        },
        { expiresIn: refreshTime },
      );

      if (!accessToken || !refreshToken) {
        return new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.prisma.refreshToken.update({
        where: { id: existRefresh.id },
        data: { token: refreshToken },
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);

      return new HttpException('Your Token Expired', HttpStatus.BAD_REQUEST);
    }
  }

  async getMe(request: any) {
    try {
      const { id } = request.user;

      const existUser = await this.prisma.user.findUnique({ where: { id } });

      const { password, updatedAt, createdAt, ...rest } = existUser;

      return rest;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(request: any) {
    try {
      const { id } = request.user;

      const existRefresh = await this.prisma.refreshToken.findFirst({
        where: { userId: id },
      });

      if (!existRefresh) {
        return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.refreshToken.delete({ where: { id: existRefresh.id } });

      return {
        message: 'Logut successfully',
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
