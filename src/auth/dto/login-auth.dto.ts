import { IsEmail, IsUUID, MinLength } from 'class-validator';

export class LoginDto {
	@IsEmail()
	email!: string;

	@MinLength(8)
	password!: string;
}

export class ChangePasswordAuthDto {
	password!: string;
	confirmPassword!: string;
	@IsEmail()
	email!: string;
	@IsUUID()
	id!: string;
}
