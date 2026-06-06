import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		UsersModule,
		AuthModule,
		MailerModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: 'smtp.gmail.com',
					port: 465,
					auth: {
						user: configService.get<string>(
							'MAILDEV_INCOMING_USER',
						),
						pass: configService.get<string>(
							'MAILDEV_INCOMING_PASS',
						),
					},
				},
				defaults: {
					from: '"No Reply" <noreply@example.com>',
				},
				// template: {
				// 	adapter: new HandlebarsAdapter(),
				// },
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
