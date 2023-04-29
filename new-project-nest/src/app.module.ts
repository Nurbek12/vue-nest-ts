import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'
import { UserModule } from './user/user.module'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AuthModule } from './auth/auth.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User } from './user/user.entity'
import { Product } from './product/product.entity'
import { Order } from './order/order.entity'
import { OrderModule } from './order/order.module'
import { ChatModule } from './chat/chat.module'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { AppGetWay } from './app.getway'
import { database, host, password, port, username } from './key'

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host,
      port,
      username,
      password,
      database,
      autoLoadModels: true,
      synchronize: true,
      logging: false
    }),
    SequelizeModule.forFeature([User, Product, Order]),
    AuthModule,
    ProductModule,
    CategoryModule,
    ChatModule,
    OrderModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'files'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'io',
      useValue: IoAdapter,
    },
    AppGetWay
  ]
})
export class AppModule {}