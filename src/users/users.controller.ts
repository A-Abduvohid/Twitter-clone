import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role, Roles } from 'src/common/guards/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/file-upload';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiProperty({ type: CreateUserDto })
  @Roles(Role.ADMIN)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(FileInterceptor('user', { storage: multerOptions.storage }))
  @Post('image')
  async createUserImage(
    @UploadedFile() user: Express.Multer.File,
    @Req() request: Request,
  ) {
    const profile_image = `${user.filename}`;
    return await this.usersService.createUserImage(profile_image, request);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAllUsers() {
    return await this.usersService.findAllUsers();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':username')
  async findOneUser(@Param('username') username: string) {
    return await this.usersService.findOneUser(username);
  }

  @ApiProperty({ type: UpdateUserDto })
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    return await this.usersService.updateUser(username, updateUserDto, request);
  }

  @Roles(Role.ADMIN)
  @Delete(':username')
  async deleteUser(@Param('username') username: string) {
    return await this.usersService.deleteUser(username);
  }
}
