import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Product } from './product.entity'
import { Category } from 'src/category/category.entity'
import { StorageHistory } from './storage.entity'

@Module({
    imports: [
        SequelizeModule.forFeature([Product, Category, StorageHistory]),
    ],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [ProductService]
})
export class ProductModule {}