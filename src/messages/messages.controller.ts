import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role, Roles } from 'src/common/guards/roles.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('message')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Roles(Role.ADMIN, Role.USER)
  @ApiProperty({ type: CreateMessageDto })
  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Req() request: Request,
  ) {
    return await this.messagesService.createMessage(createMessageDto, request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async findAllMessage(@Req() request: Request) {
    return await this.messagesService.findAllMessage(request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findOneMessage(@Param('id') id: string, @Req() request: Request) {
    return await this.messagesService.findOneMessage(id, request);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async deleteMessage(@Param('id') id: string, @Req() request: Request) {
    return await this.messagesService.deleteMessage(id, request);
  }
}
