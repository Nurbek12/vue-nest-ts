import { Controller, UseGuards, ParseIntPipe, Get, Post, Param, Body, Res, HttpStatus, Delete, Put } from '@nestjs/common'
import { Category } from './category.entity'
import { CategoryService } from './category.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getAll(@Res() response): Promise<Category> {
        const result = await this.categoryService.getAll()

        return response.status(HttpStatus.OK).json(result)
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Res() response, @Body() category: Category): Promise<Category> {
        const result = await this.categoryService.create(category)
        return response.status(HttpStatus.OK).json(result)
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Res() response, @Param('id', ParseIntPipe) id: number, @Body() category: Category): Promise<Category> {
        const result = await this.categoryService.update(id, category)
        return response.status(HttpStatus.OK).json(result)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@Res() response, @Param('id', ParseIntPipe) id: number): Promise<Boolean> {
        await this.categoryService.delete(id)
        return response.status(HttpStatus.OK).json(true)
    }
}