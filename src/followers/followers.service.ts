import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class FollowersService {
  constructor(private readonly prisma: PrismaService) {}

  async addFollower(createFollowerDto: CreateFollowerDto, request: any) {
    try {
      const { id } = request.user;

      const existUser = await this.prisma.user.findUnique({
        where: { id: createFollowerDto.followingId },
      });

      if (!existUser) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      const existFollow = await this.prisma.follower.findFirst({
        where: { followingId: existUser.id, followerId: id },
      });

      if (existFollow) {
        await this.prisma.follower.delete({ where: { id: existFollow.id } });
        return {
          message: 'You are successfully unfollow',
          statusCode: 200,
        };
      } else {
        const newFollower = await this.prisma.follower.create({
          data: {
            followerId: request.user.id,
            followingId: createFollowerDto.followingId,
          },
          include: {
            follower: {
              select: { email: true, username: true, role: true },
            },
            following: {
              select: { email: true, username: true, role: true },
            },
          },
        });

        return newFollower;
      }
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllFallowers() {
    try {
      const allFollowers = await this.prisma.follower.findMany({
        include: {
          follower: {
            select: {
              full_name: true,
              username: true,
              email: true,
            },
          },
          following: {
            select: {
              full_name: true,
              username: true,
              email: true,
            },
          },
        },
      });

      if (!allFollowers) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      return allFollowers;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllFallowersMe(request: any) {
    try {
      const { id } = request.user;

      const myFollowers = await this.prisma.follower.findMany({
        where: { followingId: id },
        include: {
          follower: {
            select: {
              full_name: true,
              username: true,
              email: true,
            },
          },
        },
      });

      if (!myFollowers.length) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      return myFollowers;
    } catch (error) {
      console.error(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
