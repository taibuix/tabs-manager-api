import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { comparePassword } from '../modules/users/helper';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/register-auth.dto';
import { AuthUser } from './interfaces/auth-user.interface';
import { User } from '../generated/prisma/client';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(
		email: string,
		pass: string,
	): Promise<Omit<User, 'password'> | null> {
		const user = await this.usersService.findByEmail(email);
		if (user && (await comparePassword(pass, user.password))) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user;
			return result;
		}

		return null;
	}

	login(user: AuthUser) {
		const payload = { email: user.email, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async register(registerDto: CreateAuthDto) {
		return this.usersService.handleRegister(registerDto);
	}
}
