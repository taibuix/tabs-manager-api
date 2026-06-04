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
import { CreateAuthDto } from './dto/create-auth.dto';
import { type Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@IsPublic()
	async login(@Request() req: ExpressRequest) {
		return this.authService.login(req.user);
	}

	@Post('register')
	async register(@Body() registerDTO: CreateAuthDto) {
		return this.authService.register(registerDTO);
	}

	@Get('profile')
	getProfile(@Request() req: ExpressRequest) {
		return req.user;
	}
}
