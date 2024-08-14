import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCommit(createCommentDto: CreateCommentDto, request: any) {
    try {
      const existTweet = await this.prisma.tweet.findUnique({
        where: { id: createCommentDto.tweetId },
      });

      if (!existTweet) {
        return new HttpException('Tweet Not Found', HttpStatus.BAD_REQUEST);
      }

      const newCommit = await this.prisma.comment.create({
        data: {
          tweetId: existTweet.id,
          userId: request.user.id,
          content: createCommentDto.content,
        },
      });

      if (!newCommit) {
        return new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return newCommit;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllCommit(request: any) {
    try {
      let allCommit;
      if (request.user.role === 'USER') {
        allCommit = await this.prisma.comment.findMany({
          where: { userId: request.user.id },
          include: {
            tweet: { select: { content: true, image_url: true } },
            user: { select: { email: true, username: true, role: true } },
          },
        });
      } else if (request.user.role === 'ADMIN') {
        allCommit = await this.prisma.comment.findMany({
          include: {
            tweet: { select: { content: true, image_url: true } },
            user: { select: { email: true, username: true, role: true } },
          },
        });
      }
      if (!allCommit) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      return allCommit;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneCommit(id: string, request: any) {
    try {
      let oneCommit;
      if (request.user.role === 'USER') {
        oneCommit = await this.prisma.comment.findUnique({
          where: { userId: request.user.id, id },
          include: {
            tweet: { select: { content: true, image_url: true } },
            user: { select: { email: true, username: true, role: true } },
          },
        });
      } else if (request.user.role === 'ADMIN') {
        oneCommit = await this.prisma.comment.findUnique({
          where: { id },
          include: {
            tweet: { select: { content: true, image_url: true } },
            user: { select: { email: true, username: true, role: true } },
          },
        });
      }
      if (!oneCommit) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      return oneCommit;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCommit(
    id: string,
    updateCommentDto: UpdateCommentDto,
    request: any,
  ) {
    try {
      const updatedCommit = await this.prisma.comment.update({
        where: { id, userId: request.user.id },
        data: updateCommentDto,
        include: {
          tweet: { select: { content: true, image_url: true } },
          user: { select: { email: true, username: true, role: true } },
        },
      });

      if (!updatedCommit) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      return updatedCommit;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCommit(id: string, request: any) {
    try {
      const commit = await this.prisma.comment.findUnique({
        where: { id, userId: request.user.id },
      });

      if (!commit) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.comment.delete({ where: { id: commit.id } });

      return {
        message: 'Deleted successfully',
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
