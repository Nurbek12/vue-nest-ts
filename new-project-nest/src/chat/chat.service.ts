import { Injectable } from "@nestjs/common"
import { InjectModel } from '@nestjs/sequelize'
import { Message } from "./chat.entity"
import { User } from "../user/user.entity"
import sequelize from "sequelize"

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message)
        private messageModel: typeof Message
    ) {}

    async getAll(): Promise<Message[]>{
        return await this.messageModel.findAll({ 
            // limit: 100,
            include: [User],
        })
    }

    async getById(id: number): Promise<Message>{
        return await this.messageModel.findByPk(id, { include: [User] })
    }

    async create(message: Message): Promise<Message> {
        const { id } = await this.messageModel.create({...message})
        return await this.getById(id)
    }

    async update(id: number, message: Message): Promise<Message> {
        await this.messageModel.update(message, { where: { id } })
        return await this.getById(id)
    }

    async delete(id: number): Promise<Boolean> {
        const data = await this.messageModel.findByPk(id)
        if(data) data.destroy()
        return true
    }
}