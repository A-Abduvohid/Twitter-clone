import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweets.module';
import { CommentsModule } from './comments/comments.module';
import { MessagesModule } from './messages/messages.module';
import { HashtegsModule } from './hashtegs/hashtegs.module';
import { NestConfigModule } from './common/modules/config/config.module';


@Module({
  imports: [
    NestConfigModule,
    AuthModule,
    UsersModule,
    TweetsModule,
    CommentsModule,
    MessagesModule,
    HashtegsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
