import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweets.module';
import { CommentsModule } from './comments/comments.module';
import { MessagesModule } from './messages/messages.module';
import { HashtegsModule } from './hashtegs/hashtegs.module';
import { NestConfigModule } from './common/modules/config/config.module';
import { PrismaService } from './common/modules/prisma/prisma.service';
import { NestJwtModule } from './common/modules/jwt/jwt.module';
import { NestMailerModule } from './common/modules/mailer/mailer.module';


@Module({
  imports: [
    NestConfigModule,
    NestJwtModule,
    NestMailerModule,
    AuthModule,
    UsersModule,
    TweetsModule,
    CommentsModule,
    MessagesModule,
    HashtegsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
