import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { TabsService } from './tabs.service';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';

@Controller('tabs')
export class TabsController {
    constructor(private readonly tabsService: TabsService) { }

    @Post()
    async create(@Body() createTabDto: CreateTabDto) {
        try {
            const newTab = await this.tabsService.create(createTabDto);
            return newTab
        }
        catch (error: any) {
            if (error instanceof ConflictException) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw error
        }
    }

    @Get()
    async findAll() {
        try {
            const tabs = await this.tabsService.findAll();
            return tabs
        } catch (error) {
            throw error
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        
        return await this.tabsService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTabDto: UpdateTabDto) {
        return await this.tabsService.update(+id, updateTabDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.tabsService.remove(+id);
    }
}
