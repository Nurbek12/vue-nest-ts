import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import { Category } from '../category/category.entity'
import { StorageHistory } from './storage.entity'

@Table
export class Product extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id: number

    @Column
    name: string

    @Column
    price: number

    @Column
    description: string

    @Column
    quantity: number

    @Column({
        type: DataType.ARRAY(DataType.STRING)
    })
    images: string[]

    @ForeignKey(() => Category)
    @Column
    categoryid: number

    @BelongsTo(() => Category)
    category: Category

    @HasMany(() => StorageHistory)
    history: StorageHistory[]
}