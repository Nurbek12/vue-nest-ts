import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript'

@Table
export class Category extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id: number

    @Column
    name: string

    @Column
    description: string

    // @ForeignKey(() => Category)
    // @Column
    // parent: number

    // @BelongsTo(() => Category)
    // child: Category[]
}