import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { IsPublic } from '../decorators/custom';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post("login")
    @UseGuards(LocalAuthGuard)
    @IsPublic()
    async handleLogin(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('profile')
    async getProfile(@Request() req) {
        return req.user;
    }
}
