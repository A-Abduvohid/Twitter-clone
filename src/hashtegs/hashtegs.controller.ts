import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HashtegsService } from './hashtegs.service';
import { CreateHashtegDto } from './dto/create-hashteg.dto';
import { UpdateHashtegDto } from './dto/update-hashteg.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('hashtegs')
@Controller('hashtegs')
export class HashtegsController {
  constructor(private readonly hashtegsService: HashtegsService) {}

  @Post()
  create(@Body() createHashtegDto: CreateHashtegDto) {
    return this.hashtegsService.create(createHashtegDto);
  }

  @Get()
  findAll() {
    return this.hashtegsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hashtegsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHashtegDto: UpdateHashtegDto) {
    return this.hashtegsService.update(+id, updateHashtegDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hashtegsService.remove(+id);
  }
}
