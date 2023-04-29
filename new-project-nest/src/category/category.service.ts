import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Category } from '../category/category.entity'

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category) 
        private categoryModel: typeof Category
    ) {}

    async getAll(): Promise<Category[]> {
        return await this.categoryModel.findAll()
    }

    async getById(id: number): Promise<Category> {
        return await this.categoryModel.findByPk(id)
    }

    async create(product: Category): Promise<Category> {
        return await this.categoryModel.create({...product})
    }

    async update(id: number, product: Category): Promise<Category> {
        await this.categoryModel.update(product, { where: { id } })
        return await this.getById(id)
    }

    async delete(id: number): Promise<Boolean> {
        const data = await this.categoryModel.findByPk(id)
        if(data) data.destroy()
        return true
    }
}