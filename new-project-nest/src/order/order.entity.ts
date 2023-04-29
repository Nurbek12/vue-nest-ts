import { Table, Column, Model, DataType, 
    ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript'
import { Product } from '../product/product.entity'
import { User } from '../user/user.entity'

@Table
export class Order extends Model {
    @ForeignKey(() => User)
    @Column
    clientid: number

    @BelongsTo(() => User, { foreignKey: 'clientid', as: 'customer' })
    customer: User
    
    @Column
    status: string

    @Column
    price: number

    @Column
    address: string

    @Column({
        type: DataType.BIGINT
    })
    date: number

    @HasMany(() => OrderProduct)
    orderProducts: OrderProduct[]
}

@Table
export class OrderProduct extends Model {
    @ForeignKey(() => Order)
    @Column({ type: DataType.INTEGER })
    orderid: number

    @BelongsTo(() => Order)
    order: Order

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER
    })
    productid: number

    @BelongsTo(() => Product)
    product: Product

    @Column({
        type: DataType.INTEGER
    })
    count: number
}