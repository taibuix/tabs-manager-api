import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAuthDto {
	@IsNotEmpty({ message: 'email can not be empty' })
	email!: string;

	@IsNotEmpty({ message: 'Password cannot be empty' })
	password!: string;
	@IsOptional()
	name?: string;
}

export class CodeAuthDto {
	@IsUUID()
	id!: string;

	@IsUUID()
	code!: string;
}
