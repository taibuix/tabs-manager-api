import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);

        if (existingUser) {
            throw new BadRequestException(
                'Email already in use',
            );
        }

        const user = await this.usersService.create({
            ...dto,
            password: dto.password,
        });

        return {
            id: user.id,
            email: user.email,
            username: user.name,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(
            dto.email,
        );

        if (!user) {
            throw new UnauthorizedException(
                'Invalid credentials',
            );
        }

        const passwordValid =
            await bcrypt.compare(
                dto.password,
                user.password,
            );

        if (!passwordValid) {
            throw new UnauthorizedException(
                'Invalid credentials',
            );
        }

        const payload = {
            sub: user.id,
            email: user.email,
        };

        return {
            access_token:
                await this.jwtService.signAsync(
                    payload,
                ),
        };
    }
}
