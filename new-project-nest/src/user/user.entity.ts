import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table
export class User extends Model {
    @Column
    name: string

    @Column
    email: string

    @Column
    phone: string

    @Column
    image: string

    @Column
    address: string

    @Column
    password: string

    @Column({
        type: DataType.STRING,
        defaultValue: 'user',
    })
    role: 'admin' | 'user'
}