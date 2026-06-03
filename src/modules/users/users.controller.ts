import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpStatus,
    HttpException,
    NotFoundException,
    Put,
    ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() data: CreateUserDto) {
        try {
            const user = await this.usersService.create(data);
            console.log(user)
            return user;
        } catch (error: any) {
            if (error instanceof ConflictException) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll() {
        const users = await this.usersService.findAll();
        if (users.length === 0) {
            console.warn('No users found in the database.');
        }
        return users;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            const user = await this.usersService.findOne(id);
            return user;
        } catch (error: any) {
            throw error instanceof NotFoundException
                ? error
                : new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        try {
            const updatedUser = await this.usersService.update(id, updateUserDto);
            return updatedUser;
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            await this.usersService.remove(id);
        } catch (error: any) {
            throw error instanceof NotFoundException
                ? error
                : new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
