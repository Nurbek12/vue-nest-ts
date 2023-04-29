import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Category } from './category.entity'

@Module({
    imports: [SequelizeModule.forFeature([Category])],
    providers: [CategoryService],
    controllers: [CategoryController]
})
export class CategoryModule {}