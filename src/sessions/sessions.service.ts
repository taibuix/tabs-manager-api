import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

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
    return await this.prisma.session.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.session.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    return await this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.session.delete({
      where: { id },
    });
  }
}
