import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Product } from './product.entity'
import { Category } from '../category/category.entity'
import { StorageHistory } from './storage.entity'
// import sequelize from 'sequelize'
// import * as moment from 'moment'

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product) 
        private productModel: typeof Product,
        @InjectModel(StorageHistory) 
        private historyModel: typeof StorageHistory
    ) {}

    async getAll(): Promise<Product[]> {
        return await this.productModel.findAll({ include: Category })
    }

    async getStorage() {
        return await this.productModel.findAll({ attributes: ['quantity', 'name', 'id'], include: [StorageHistory] })
        // return await this.productModel.aggregate()
    }

    async updateStorage(history: { productid: number, count: number, status: number }){
        const product = await this.productModel.findByPk(history.productid)
        await product.update({ quantity: Number(product.quantity) + Number(history.status) * Number(history.count) })
        return await this.historyModel.create(history)
    }

    async getStatistic(){
        return await this.historyModel.findAll({ 
            limit: 12,
            order: [['createdAt', 'DESC']],
            group: ['id', 'createdAt']
        })
    }

    async getById(id: number): Promise<Product> {
        return await this.productModel.findByPk(id, { include: Category })
    }

    async create(product: Product): Promise<Product> {
        const { id } = await this.productModel.create({...product})
        return this.getById(id)
    }

    async update(id: number, product: Product): Promise<Product> {
        await this.productModel.update(product, { where: { id } })
        return await this.getById(id)
    }

    async delete(id: number): Promise<Boolean> {
        const data = await this.productModel.findByPk(id)
        if(data) data.destroy()
        return true
    }
}