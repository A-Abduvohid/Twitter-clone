import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TweetsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createTweet(
    createTweetDto: CreateTweetDto,
    request: any,
    fileUrl: string | null,
  ) {
    try {
      const newTweet = {
        content: createTweetDto.content,
        image_url: fileUrl,
        userId: request.user.id,
      };

      return await this.prisma.tweet.create({
        data: newTweet,
      });
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllTweets(request: any) {
    try {
      const { role, id } = request.user;
      let tweets;

      if (role === 'ADMIN') {
        tweets = await this.prisma.tweet.findMany({
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                full_name: true,
                bio: true,
              },
            },
          },
        });
      } else {
        tweets = await this.prisma.tweet.findMany({
          where: { userId: id },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                full_name: true,
                bio: true,
              },
            },
          },
        });
      }

      if (tweets.length === 0) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      return tweets;
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async tweetLike(id: string, request: any) {
    try {
      const existLike = await this.prisma.like.findFirst({
        where: { userId: request.user.id, tweetId: id },
      });

      if (existLike) {
        await this.prisma.like.delete({ where: { id: existLike.id } });
        return {
          message: 'unlike successfully',
          statusCode: 200,
        };
      }

      await this.prisma.like.create({
        data: { tweetId: id, userId: request.user.id },
      });
      return {
        message: 'like successfully',
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

  async findOneTweet(id: string, request: any) {
    try {
      const tweet = await this.prisma.tweet.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              full_name: true,
              bio: true,
            },
          },
        },
      });

      if (!tweet) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      if (request.user.role === 'USER') {
        if (tweet.userId !== request.user.id) {
          return new HttpException('Unautorized', HttpStatus.UNAUTHORIZED);
        }
      }

      return tweet;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTweet(id: string, updateTweetDto: UpdateTweetDto, request: any) {
    try {
      const tweet = await this.prisma.tweet.findUnique({ where: { id } });

      if (!tweet) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      if (request.user.id === tweet.userId || request.user.role === 'ADMIN') {
        const updatedTweet = await this.prisma.tweet.update({
          where: { id },
          data: updateTweetDto,
        });

        return {
          message: 'Updated Successfully',
          statusCode: 200,
          data: updatedTweet,
        };
      }

      return new HttpException('Unautorized', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTweet(id: string, request: any) {
    try {
      const tweet = await this.prisma.tweet.findUnique({ where: { id } });

      if (!tweet) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      if (request.user.id === tweet.userId || request.user.role === 'ADMIN') {
        if (tweet.image_url) {
          const filePath = path.join(__dirname, '..', '..', tweet.image_url);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log("Faylni o'chirishda xatolik yuz berdi:", err);
            }
          });
        }

        await this.prisma.like.deleteMany({
          where: { tweetId: id },
        });

        await this.prisma.tweet.delete({
          where: { id },
        });

        return {
          message: 'Deleted Successfully',
          statusCode: 200,
        };
      }

      return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
