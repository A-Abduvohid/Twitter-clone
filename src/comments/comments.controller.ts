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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role, Roles } from 'src/common/guards/roles.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('tweet/comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiProperty({ type: CreateCommentDto })
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async createCommit(
    @Body() createCommentDto: CreateCommentDto,
    @Req() request: Request,
  ) {
    return await this.commentsService.createCommit(createCommentDto, request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async findAllCommit(@Req() request: Request) {
    return await this.commentsService.findAllCommit(request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findOneCommit(@Param('id') id: string, @Req() request: Request) {
    return await this.commentsService.findOneCommit(id, request);
  }

  @ApiProperty({ type: UpdateCommentDto })
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  async updateCommit(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() request: Request,
  ) {
    return await this.commentsService.updateCommit(
      id,
      updateCommentDto,
      request,
    );
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCommit(@Param('id') id: string, @Req() request: Request) {
    return await this.commentsService.deleteCommit(id, request);
  }
}
