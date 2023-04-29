import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private userModel: typeof User
    ) {}

    async getAll(): Promise<User[]> {
        return await this.userModel.findAll({
            attributes: ['id', 'name', 'address', 'phone', 'image', 'email', 'role']
        })
    }
    
    async getById(id: number): Promise<User> {
        return await this.userModel.findByPk(id)
    }

    async getByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({where: {email}})
    }

    async create(user: User, image: string | undefined): Promise<User> {
        return await this.userModel.create({...user, image})
    }

    async update(id: number, user: User, image: string | undefined): Promise<User> {
        await this.userModel.update({...user, image}, { where: { id } })
        return await this.getById(id)
    }

    async changePass(id: number, password: string): Promise<boolean> {
        await this.userModel.update({ password }, { where: { id } })
        return true
    }

    async delete(id: number): Promise<Boolean> {
        const data = await this.userModel.findByPk(id)
        if(data) data.destroy()
        return true
    }
}