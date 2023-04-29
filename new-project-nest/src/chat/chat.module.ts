import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { Message } from './chat.entity'
import { User } from '../user/user.entity'

@Module({
    imports: [
        SequelizeModule.forFeature([Message, User])
    ],
    controllers: [ChatController],
    providers: [ChatService]
})
export class ChatModule { }