import { Controller, Body, Get, Post, Param, UseGuards,
    UseInterceptors, UploadedFile, Delete, ParseIntPipe, 
    Put, Req } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserService } from './user.service'
import { User } from './user.entity'
import upload from '../details/upload'
import { AuthGuard } from '../auth/auth.guard'
import * as bcrypt from 'bcryptjs'

@Controller('user')
export class UserController {
    constructor(
        private readonly userSerive: UserService
    ) {}
    
    @Get()
    @UseGuards(AuthGuard)
    async getAll() {
        return await this.userSerive.getAll()
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', upload))
    async create(@Body() user: User, @UploadedFile() file: Express.Multer.File){
        return await this.userSerive.create(user, file?.filename)
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image', upload))
    async update(@Param('id', ParseIntPipe) id: number, @Body() user: User, @UploadedFile() file: Express.Multer.File) {
        return await this.userSerive.update(id, user, file?.filename)
    }

    @Put('/edit/pass')
    @UseGuards(AuthGuard)
    async changePass(@Req() req, 
        @Body('newpassword') pass1: string, @Body('password') pass2: string): Promise<boolean> {
        const user = await this.userSerive.getById(req?.user.id)
        const match = await bcrypt.compare(pass2, user.password)
        if(!match || !user) return false
        const hash = await bcrypt.hash(pass1, 10)
        await this.userSerive.changePass(user.id, hash)
        return true
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
        return await this.userSerive.delete(id)
    }
}