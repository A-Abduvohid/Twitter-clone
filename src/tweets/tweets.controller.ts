import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role, Roles } from 'src/common/guards/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerOptions } from 'src/common/utils/file-upload';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('tweets')
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @ApiProperty({ type: CreateTweetDto })
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: multerOptions.storage }))
  async createTweet(
    @Body() createTweetDto: CreateTweetDto,
    @Req() request: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let fileUrl: string | null = null;

    if (file) {
      fileUrl = `${file.filename}`;
    }
    return await this.tweetsService.createTweet(
      createTweetDto,
      request,
      fileUrl,
    );
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async findAllTweets(@Req() request: Request) {
    return await this.tweetsService.findAllTweets(request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('/:id/likes')
  async tweetLike(@Param('id') id: string, @Req() request: Request) {
    return await this.tweetsService.tweetLike(id, request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findOneTweet(@Param('id') id: string, @Req() request: Request) {
    return await this.tweetsService.findOneTweet(id, request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  async updateTweet(
    @Param('id') id: string,
    @Body() updateTweetDto: UpdateTweetDto,
    @Req() request: Request,
  ) {
    return await this.tweetsService.updateTweet(id, updateTweetDto, request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async deleteTweet(@Param('id') id: string, @Req() request: Request) {
    return await this.tweetsService.deleteTweet(id, request);
  }
}
