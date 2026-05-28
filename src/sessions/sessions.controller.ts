import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    HttpException,
    ConflictException,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @Post()
    async create(@Body() createSessionDto: CreateSessionDto) {
        try {
            const session = await this.sessionsService.create(createSessionDto)
            return session
        }
        catch (error) {
            if (error instanceof ConflictException) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
        }
    }

    @Get()
    async findAll() {
        try {
            const sessions = await this.sessionsService.findAll();
            return sessions
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            const session = await this.sessionsService.findOne(id);
            return session
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
        try {
            const session = await this.sessionsService.update(id, updateSessionDto);
            return session
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            await this.sessionsService.remove(id);
        }
        catch (error) {
            throw error
        }
    }
}
