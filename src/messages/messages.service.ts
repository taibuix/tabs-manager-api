import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class MessagesService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateMessageDto) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			return await this.prisma.message.create({
				data: dto,
			});
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002'
			) {
				throw new ConflictException('Message already exists');
			}

			throw new InternalServerErrorException('Failed to create message');
		}
	}

	async findOne(id: string) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		const message = await this.prisma.message.findUnique({
			where: {
				id,
			},
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return message;
	}
}
