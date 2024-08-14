import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Role, Roles } from 'src/common/guards/roles.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('followers')
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async addFollower(
    @Body() createFollowerDto: CreateFollowerDto,
    @Req() request: Request,
  ) {
    return await this.followersService.addFollower(createFollowerDto, request);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAllFallowers() {
    return await this.followersService.findAllFallowers();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('me')
  async findAllFallowersMe(@Req() request: Request) {
    return await this.followersService.findAllFallowersMe(request);
  }
}
