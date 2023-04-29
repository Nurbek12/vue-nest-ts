import { Body, Controller, Post } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { AuthService } from './auth.service'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'

@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }
    
    @Post('/login')
    async signin(@Body() user: User) {
        return await this.authService.signin(user.email, user.password)
    }

    @Post('/signup')
    async signup(@Body() user: User): Promise<any> {
        const hashed = await bcrypt.hash(user.password, 10)
        await this.userService.create({...user, password: hashed} as User, undefined)
        return true
    }
}