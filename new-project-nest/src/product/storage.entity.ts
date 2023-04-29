import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Product } from './product.entity'

@Table
export class StorageHistory extends Model {
    @Column
    status: string

    @ForeignKey(() => Product)
    @Column
    productid: number

    @BelongsTo(() => Product, 'productid')
    product: Product

    @Column
    count: number
}