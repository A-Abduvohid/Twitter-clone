import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto, request: any) {
    try {
      const newMessage = await this.prisma.message.create({
        data: { senderId: request.user.id, ...createMessageDto },
      });

      if (!newMessage) {
        return new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return newMessage;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllMessage(request: any) {
    try {
      let allMessages;
      if (request.user.role === 'ADMIN') {
        allMessages = await this.prisma.message.findMany({
          include: {
            sender: { select: { id: true, email: true, username: true } },
            receiver: { select: { id: true, email: true, username: true } },
          },
        });
      } else {
        allMessages = await this.prisma.message.findMany({
          where: { senderId: request.user.id },
          include: {
            receiver: { select: { id: true, email: true, username: true } },
          },
        });
      }

      if (!allMessages) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      return allMessages;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneMessage(id: string, request: any) {
    try {
      let oneMessage;
      if (request.user.role === 'ADMIN') {
        oneMessage = await this.prisma.message.findFirst({
          where: { id },
          include: {
            sender: { select: { id: true, email: true, username: true } },
            receiver: { select: { id: true, email: true, username: true } },
          },
        });
      } else {
        oneMessage = await this.prisma.message.findFirst({
          where: { senderId: request.user.id, id },
          include: {
            receiver: { select: { id: true, email: true, username: true } },
          },
        });
      }

      if (!oneMessage) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      return oneMessage;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMessage(id: string, request: any) {
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
