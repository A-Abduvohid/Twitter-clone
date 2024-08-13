import { Module } from '@nestjs/common';
import { HashtegsService } from './hashtegs.service';
import { HashtegsController } from './hashtegs.controller';

@Module({
  controllers: [HashtegsController],
  providers: [HashtegsService],
})
export class HashtegsModule {}
