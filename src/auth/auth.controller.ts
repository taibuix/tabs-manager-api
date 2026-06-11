import {
	Controller,
	Post,
	Body,
	UseGuards,
	Request,
	Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { IsPublic } from '../decorators/custom';
import { CodeAuthDto, CreateAuthDto } from './dto/register-auth.dto';
import { type AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly mailerService: MailerService,
	) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@IsPublic()
	login(@Request() req: AuthenticatedRequest) {
		return this.authService.login(req.user);
	}

	@IsPublic()
	@Post('register')
	async register(@Body() registerDTO: CreateAuthDto) {
		return this.authService.register(registerDTO);
	}

	@Get('mail')
	@IsPublic()
	async sendWelcomeEmail() {
		await this.mailerService.sendMail({
			to: 'taibui97@outlook.com',
			subject: 'Welcome!',
			template: 'register',
			context: { name: 'tai', activationCode: '123' },
		});
		return 'ok';
	}

	@Get('profile')
	getProfile(@Request() req: AuthenticatedRequest) {
		return req.user;
	}

	@Post('check-code')
	@IsPublic()
	checkCode(@Body() registerDto: CodeAuthDto) {
		return this.authService.checkCode(registerDto);
	}

	@Post('retry-active')
	@IsPublic()
	async retryActive(@Body('email') email: string) {
		return await this.authService.retryActive(email);
	}
}
