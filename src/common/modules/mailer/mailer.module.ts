import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.MAIL_HOST'),
          port: Number(configService.get<string>('mail.MAIL_PORT')),
          secure: false,
          auth: {
            user: configService.get<string>('mail.MAIL_USER'),
            pass: configService.get<string>('mail.MAIL_PASS'),
          },
        },
      }),
    }),
  ],
})
export class NestMailerModule {}
