import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { serverport } from './key'

async function bootstrap(){
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  await app.listen(serverport)
}

bootstrap()