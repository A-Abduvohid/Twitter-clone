import { Module } from '@nestjs/common';
import { HashtegsService } from './hashtegs.service';
import { HashtegsController } from './hashtegs.controller';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Module({
  controllers: [HashtegsController],
  providers: [HashtegsService, PrismaService],
})
export class HashtegsModule {}
