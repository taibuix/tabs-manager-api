import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { hashPassword } from './helper';
import { Prisma, User } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from '../../decorators/custom';
import { CreateAuthDto } from '../../auth/dto/register-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
	constructor(
		private prisma: PrismaService,
		private readonly mailerService: MailerService,
	) {}

	async create(data: CreateUserDto): Promise<User> {
		data.password = await hashPassword(data.password);
		try {
			const user = await this.prisma.user.create({
				data,
			});
			return user;
		} catch (error: any) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException(
						'A user with this email already exists.',
					);
				}
			}
			throw error;
		}
	}

	async findAll() {
		return await this.prisma.user.findMany();
	}

	@IsPublic()
	async findOne(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});
		if (!user) {
			throw new NotFoundException(`User with id ${id} not found.`);
		}
		return user;
	}

	async findByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});
		if (!user || typeof user === 'undefined') {
			throw new NotFoundException(`User with email ${email} not found`);
		}
		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		try {
			const updatedUser = await this.prisma.user.update({
				where: { id },
				data: updateUserDto,
			});
			return updatedUser;
		} catch (error: any) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('User not found');
			}
			throw error;
		}
	}

	async remove(id: string) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException(`User with id ${id} not found.`);
		}
		return await this.prisma.user.delete({
			where: { id },
		});
	}

	async handleRegister(registerDTO: CreateAuthDto) {
		registerDTO.password = await hashPassword(registerDTO.password);

		const codeId: string = uuidv4();
		const codeExpired = dayjs().add(1, 'day').toDate();
		const { email, password, name } = registerDTO;
		try {
			const user = await this.prisma.user.create({
				data: {
					email,
					password,
					name,
					codeId,
					codeExpired,
				},
			});
			await this.mailerService.sendMail({
				to: user.email,
				subject: 'Activate your account!',
				template: 'register',
				context: {
					name: user?.name ?? user.email,
					activationCode: user.codeId,
				},
			});
			return user;
		} catch (error: any) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException(
						'A user with this email already exists.',
					);
				}
			}
			throw error;
		}
	}
}
