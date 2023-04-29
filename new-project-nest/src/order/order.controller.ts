import { Controller, Get, Post, Delete, UseGuards, Body, 
    Query, Param, ParseIntPipe } from "@nestjs/common"
import { Order } from "../order/order.entity"
import { OrderService } from './order.service'
import { ProductService } from "../product/product.service"
import { AuthGuard } from "../auth/auth.guard"

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async getAll(@Query('id') id: number | undefined){
        return await this.orderService.getAll(id)
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() order: Order) {
        if(!order.price) order.price = this.summary(order)
        this.registerHistory(order.orderProducts)
        return await this.orderService.create(order)
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number){
        return await this.orderService.delete(id)
    }

    summary({orderProducts}){
        return orderProducts.reduce((summ: number, { count, price }):
        number => summ + Number(count) * Number(price), 0)
    }

    private async registerHistory(orderProducts){
        orderProducts.map(async el => {
            await this.productService.updateStorage({...el, status: -1})
        })
    }
}