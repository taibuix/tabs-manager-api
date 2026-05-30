import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TabsService {
    constructor(private prisma: PrismaService) { }
    async create(createTabDto: CreateTabDto) {
        try {
            const newTab = this.prisma.tab.create({ data: createTabDto })
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('A user with this email already exists.');
            }
            throw error
        }
    }

    async findAll() {
        
        return `This action returns all tabs`;
    }

    async findOne(id: number) {
        return `This action returns a #${id} tab`;
    }

    async update(id: number, updateTabDto: UpdateTabDto) {
        return `This action updates a #${id} tab`;
    }

    async remove(id: number) {
        return `This action removes a #${id} tab`;
    }
}
