import { Table, Column, Model, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript"
import { User } from "../user/user.entity"

@Table
export class Message extends Model {
    @Column
    senderid: number

    @BelongsTo(() => User, 'senderid')
    sender: User

    @Column
    text: string

    @Column
    date: string
}