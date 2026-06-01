import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '7d',
            },
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [
        JwtModule
    ]
})
export class AuthModule { }
