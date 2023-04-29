import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        ) {}

    async signin(email: string, pass: string): Promise<any> {
        const user = await this.userService.getByEmail(email)
        if(!user) throw new UnauthorizedException()
        const { password, ...result } = user
        const comp = await bcrypt.compare(password, pass)
        if(comp) throw new UnauthorizedException()
        return {
            token: await this.jwtService.signAsync({
                id: user.id,
                email: user.email,
            }),
            user: result.dataValues
        }
    }
}