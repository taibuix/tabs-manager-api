import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { comparePassword } from '../modules/users/helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(email: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findByEmail(email);
        console.log(user?.password)
        if (!user) {
            throw new NotFoundException("Username Not Found")
        }
        if (!(await comparePassword(pass, user.password))) {
            throw new UnauthorizedException("Password is not correct");
        }
        const payload = { sub: user.id, email: user.email, name: user.name }

        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}