import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsUUID()
	codeId?: string;

	@IsBoolean()
	isActive?: boolean;

	codeExpired?: Date;
}
