import { Injectable } from '@nestjs/common';
import { CreateHashtegDto } from './dto/create-hashteg.dto';
import { UpdateHashtegDto } from './dto/update-hashteg.dto';

@Injectable()
export class HashtegsService {
  create(createHashtegDto: CreateHashtegDto) {
    return 'This action adds a new hashteg';
  }

  findAll() {
    return `This action returns all hashtegs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hashteg`;
  }

  update(id: number, updateHashtegDto: UpdateHashtegDto) {
    return `This action updates a #${id} hashteg`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashteg`;
  }
}
