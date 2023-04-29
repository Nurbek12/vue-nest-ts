import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user/user.entity'
import { Product } from './product/product.entity'
import { Order } from './order/order.entity'

@Injectable()
export class AppService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(Product)
        private productModel: typeof Product,
        @InjectModel(Order)
        private orderModel: typeof Order,
    ) {}

    async getAllInfo(){
        const clients = (await this.userModel.findAndCountAll({where: {role: 'user'}})).count
        const products = (await this.productModel.findAndCountAll()).count
        const orders = (await this.orderModel.findAndCountAll()).count
        const profit = await this.orderModel.sum('price')
        return { clients, products, orders, profit }
    }
}