import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async createUser(createUserDto: any) {
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

  async findAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: { password: false },
      });

      if (!users) {
        return new HttpException('Not Found', HttpStatus.BAD_REQUEST);
      }

      return users;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneUser(username: string) {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: { username },
        select: { password: false },
      });

      if (!existUser) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      return existUser;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    username: string,
    updateUserDto: UpdateUserDto,
    request: any,
  ) {
    try {
      const { role } = request.user;

      if (role !== 'ADMIN' || username !== request.user.username) {
        return new HttpException(
          "Siz boshqani userni ma'lumotlarini yangilay olmaysiz",
          HttpStatus.BAD_GATEWAY,
        );
      }
      const existUser = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!existUser) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.update({
        where: { username: existUser.username },
        data: updateUserDto,
      });

      return {
        message: 'Updated Successfully',
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

  async deleteUser(username: string) {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!existUser) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.delete({ where: { id: existUser.id } });

      return {
        message: 'Deleted Successfully',
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
