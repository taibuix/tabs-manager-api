import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class SessionsService {
    constructor(private prisma: PrismaService) { }

    create(createSessionDto: CreateSessionDto) {
        const session = this.prisma.session.create({
            data: {
                name: createSessionDto.name ?? '',
                userId: createSessionDto.userId,
            },
        });
        return session;
    }

    async findAll() {
        try {
            const sessions = await this.prisma.session.findMany();
            return sessions
        } catch (error) {
            throw error
        }
    }

    async findOne(id: string) {
        const session = await this.prisma.session.findUnique({
            where: { id },
        });

        if (!session) {
            throw new NotFoundException("Session not Found")
        }

        return session
    }

    async update(id: string, updateSessionDto: UpdateSessionDto) {
        try {
            const updatedSession = await this.prisma.session.update({
                where: { id },
                data: updateSessionDto,
            });
            return updatedSession
        }
        catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException('Session not found');
            }
            throw error
        }
    }

    async remove(id: string) {
        try {
            await this.prisma.session.delete({
                where: { id },
            })
        } catch (error) {
            throw error
        }
    }
}
