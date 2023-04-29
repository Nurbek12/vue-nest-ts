import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Order, OrderProduct } from './order.entity'
import { Product } from '../product/product.entity'
import { User } from '../user/user.entity'

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order)
        private orderModel: typeof Order
    ){}

    async getAll(id: number | undefined){
        const where = {}
        if(id) Object.assign(where, { clientid: id })
        
        return await this.orderModel.findAll({ where, include: [{ model: OrderProduct, include: [Product]}, User] })
    }

    async getById(id: number){
        return await this.orderModel.findByPk(id, { include: [{ model: OrderProduct, include: [Product]}, User] })
    }

    async create(order: Order){
        const { id } = await this.orderModel.create({...order}, { include: OrderProduct })
        // this.removeProductsInStorage(order.orderProducts)
        return await this.getById(id)
    }

    async delete(id: number): Promise<Boolean> {
        const data = await this.orderModel.findByPk(id)
        if(data) data.destroy()
        return true
    }

    // private async removeProductsInStorage(orderProducts) {
    //     orderProducts.map(async ({ productid, count }) => {
    //         const { quantity, id } = await this.productModel.findByPk(productid)
    //         await this.productModel.update({ quantity: quantity-count }, { where: { id } })
    //     })
    // }
}