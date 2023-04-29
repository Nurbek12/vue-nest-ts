import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { secret } from '../key'

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret,
            signOptions: { expiresIn: '120d' }
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
