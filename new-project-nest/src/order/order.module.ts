import { Module } from '@nestjs/common'
import { User } from 'src/user/user.entity'
import { Product } from 'src/product/product.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { Order, OrderProduct } from './order.entity'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { UserModule } from 'src/user/user.module'
import { ProductModule } from 'src/product/product.module'

@Module({
    imports: [
        SequelizeModule.forFeature([User, Product, Order, OrderProduct]),
        ProductModule,
        UserModule
    ],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}