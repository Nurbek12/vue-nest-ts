import { Controller, UseGuards, ParseIntPipe, Get, Post, Param, Body, 
    Res, HttpStatus, Delete, Put, UploadedFiles, UseInterceptors 
    } from '@nestjs/common'
import { Product } from './product.entity'
import { ProductService } from './product.service'
import { AuthGuard } from '../auth/auth.guard'
import { FilesInterceptor } from '@nestjs/platform-express'
import upload from '../details/upload'

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async getAll(@Res() response): Promise<Product[]> {
        const result = await this.productService.getAll()
        return response.status(HttpStatus.OK).json(result)
    }

    @Get('/storage')
    @UseGuards(AuthGuard)
    async getStorage(): Promise<Product[]> {
        return await this.productService.getStorage()
    }

    @Get('/statistic')
    @UseGuards(AuthGuard)
    async getStatistic(): Promise<any[]> {
        return await this.productService.getStatistic()
    }

    @Post('/storage')
    @UseGuards(AuthGuard)
    async updateStorage(@Body() history){
        return await this.productService.updateStorage(history)
    }

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('image', 10, upload))
    async create(@Res() response, @Body() product: Product, @UploadedFiles() files: Express.Multer.File[]): Promise<Product> {
        product.images = []
        for(let i: number = 0; i < files.length; i++) {
            product.images.push(files[i].filename)
        }
        const result = await this.productService.create(product)
        return response.status(HttpStatus.OK).json(result)
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('image', 10, upload))
    async update(@Res() response, @Param('id', ParseIntPipe) id: number, @Body() product: Product, @UploadedFiles() files: Express.Multer.File[]): Promise<Product> {
        product.images = []
        for(let i: number = 0; i < files.length; i++) {
            product.images.push(files[i].filename)
        }
        const result = await this.productService.update(id, product)
        return response.status(HttpStatus.OK).json(result)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@Res() response, @Param('id', ParseIntPipe) id: number): Promise<Boolean> {
        await this.productService.delete(id)
        return response.status(HttpStatus.OK).json(true)
    }
}