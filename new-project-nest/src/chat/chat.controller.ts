import { Controller, Get, UseGuards, Post, Put, Body, Delete } from "@nestjs/common"
import { AuthGuard } from '../auth/auth.guard'
import { ChatService } from './chat.service'
import { Message } from "./chat.entity"

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    async getMessages(){
        return await this.chatService.getAll()
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() message: Message){
        return await this.chatService.create(message)
    }
}